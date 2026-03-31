import { Coupon } from "@schemas/event/coupon.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { getCachedCoupons, setCachedCoupons } from "./helpers/redis";

import ApiError from "@utils/ApiError";

const fetchCoupons = async (eventID: string, ownerID: string) => {
  const coupons =
    (await getCachedCoupons(eventID, ownerID)) ??
    (await getCoupons(eventID, ownerID));

  return coupons as Coupon[];
};

const getCoupons = async (eventID: string, ownerID: string) => {
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

  const coupons = dbEvent.coupons ?? [];

  await setCachedCoupons(eventID, ownerID, coupons);

  return coupons;
};

export default fetchCoupons;
