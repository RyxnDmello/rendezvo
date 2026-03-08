import { Coupon } from "@schemas/event/coupon.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { getCachedCoupons, setCachedCoupons } from "./helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const fetchCoupons = async (eventID: string, ownerID: string) => {
  try {
    return (
      ((await getCachedCoupons(eventID, ownerID)) as unknown as Coupon[]) ??
      (await getCoupons(eventID, ownerID))
    );
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Coupons Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

const getCoupons = async (eventID: string, ownerID: string) => {
  const [dbEvent, dbOrganizer] = await Promise.all([
    EventModel.findById(eventID, {
      ownerID: 1,
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

  if (dbEvent.ownerID !== ownerID) {
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
