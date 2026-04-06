import { EventCoupon } from "@schemas/event/coupon.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { getCachedCoupon, setCachedCoupon } from "./helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that retrieves a coupon from an event's coupon list.
 *
 * This function attempts to fetch the coupon from cache first. If not
 * available, it retrieves the coupon from the database. It validates
 * the event's existence and the organizer's authorization. It caches
 * the result for future requests.
 *
 * @param {string} id - The ID of the coupon.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The retrieved coupon.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if event has no coupons.
 * - An ApiError if coupon does not exist.
 */
const fetchCoupon = async (id: string, eventID: string, ownerID: string) => {
  const coupon =
    (await getCachedCoupon(id, eventID, ownerID)) ??
    (await getCoupon(eventID, ownerID, id));

  return coupon as EventCoupon;
};

const getCoupon = async (id: string, eventID: string, ownerID: string) => {
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
      "You Are Not Authorized To Retrieve Coupons From This Event",
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

  await setCachedCoupon(id, eventID, ownerID, coupon);

  return coupon;
};

export default fetchCoupon;
