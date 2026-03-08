import { Coupon } from "@schemas/event/coupon.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { getCachedCoupon, setCachedCoupon } from "./helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const fetchCoupon = async (id: string, eventID: string, ownerID: string) => {
  try {
    return (
      ((await getCachedCoupon(id, eventID, ownerID)) as unknown as Coupon) ??
      (await getCoupon(eventID, ownerID, id))
    );
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Coupon Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

const getCoupon = async (id: string, eventID: string, ownerID: string) => {
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
