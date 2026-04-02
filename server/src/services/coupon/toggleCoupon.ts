import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedCoupon, clearCachedCoupons } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that toggles a coupon's active status in an event's coupon list.
 *
 * This function validates the event's existence and the organizer's authorization.
 * It finds the coupon and toggles its active state. It updates the event and clears
 * related cache.
 *
 * @param {string} id - The ID of the coupon.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns A success response if the coupon is toggled.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if event has no coupons.
 * - An ApiError if coupon does not exist.
 * - An ApiError if database update fails.
 */
const toggleCoupon = async (id: string, eventID: string, ownerID: string) => {
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
      "You Are Not Authorized To Toggle Coupons From This Event",
      "FORBIDDEN",
    );
  }

  if (!dbEvent.coupons || dbEvent.coupons.length === 0) {
    throw new ApiError("Event With Given ID Has No Coupons", "BAD_REQUEST");
  }

  const index = dbEvent.coupons.findIndex((coupon) => coupon.id === id);

  if (index === -1) {
    throw new ApiError("Coupon With Given ID Does Not Exist", "BAD_REQUEST");
  }

  dbEvent.coupons[index]!.active = !dbEvent.coupons[index]!.active;

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: eventID,
    },
    {
      $set: {
        coupons: dbEvent.coupons,
      },
    },
    {
      runValidators: true,
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Toggle Coupon Due To Server Error",
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

export default toggleCoupon;
