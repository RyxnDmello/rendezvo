import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedCoupon, clearCachedCoupons } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that deletes a coupon from an event's coupon list.
 *
 * This function validates the event's existence and the organizer's authorization.
 * It ensures the coupon exists, is inactive, and has not been used. It removes the
 * coupon from the event and clears related cache.
 *
 * @param {string} id - The ID of the coupon.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns A success response if the coupon is deleted.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if event has no coupons.
 * - An ApiError if coupon does not exist.
 * - An ApiError if coupon is active.
 * - An ApiError if coupon has been used.
 * - An ApiError if database update fails.
 */
const deleteCoupon = async (id: string, eventID: string, ownerID: string) => {
  const [dbEvent, dbOrganizer] = await Promise.all([
    EventModel.findById(eventID, {
      owner: 1,
      coupons: 1,
    }).lean({
      versionKey: false,
    }),
    OrganizerModel.exists({
      _id: ownerID,
    }),
  ]);

  if (!dbEvent) {
    throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (!dbOrganizer) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (dbEvent.owner.toString() !== ownerID) {
    throw new ApiError(
      "You Are Not Authorized To Delete Coupons From This Event",
      "FORBIDDEN",
    );
  }

  if (!dbEvent.coupons || dbEvent.coupons.length === 0) {
    throw new ApiError("Event With Given ID Has No Coupons", "BAD_REQUEST");
  }

  const coupon = dbEvent.coupons.find((coupon) => coupon.id === id);

  if (!coupon) {
    throw new ApiError("Coupon With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (coupon.active) {
    throw new ApiError(
      "Coupon Must Be Set As Inactive Before Deletion",
      "BAD_REQUEST",
    );
  }

  if (coupon.quantity.used !== 0) {
    throw new ApiError(
      "Coupon Cannot Be Deleted Since Coupons Have Been Used",
      "BAD_REQUEST",
    );
  }

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: eventID,
    },
    {
      $pull: {
        coupons: {
          id: id,
        },
      },
    },
    {
      runValidators: true,
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Delete Coupon Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  await Promise.all([
    clearCachedEvents(ownerID),
    clearCachedEvent(eventID, ownerID),
    clearCachedCoupons(eventID, ownerID),
    clearCachedCoupon(id, eventID, ownerID),
  ]);

  return {
    success: true,
  };
};

export default deleteCoupon;
