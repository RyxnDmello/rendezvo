import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { FetchCouponValidatorSchema } from "@validators/coupon/fetchCoupon.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const fetchCoupon = async (
  id: string,
  couponID: string,
  query: FetchCouponValidatorSchema
) => {
  try {
    const [dbEvent, dbOrganizer] = await Promise.all([
      EventModel.findById(id, {
        ownerID: 1,
        coupons: 1,
      }).lean({
        versionKey: false,
      }),
      OrganizerModel.exists({
        _id: query.ownerID,
      }),
    ]);

    if (!dbEvent) {
      throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (dbEvent.ownerID !== query.ownerID) {
      throw new ApiError(
        "You Do Not Have The Permission To Make This Request",
        "UNAUTHORIZED"
      );
    }

    if (!dbEvent.coupons || dbEvent.coupons.length === 0) {
      throw new ApiError("Event With Given ID Has No Tickets", "BAD_REQUEST");
    }

    const coupon = dbEvent.coupons.find((coupon) => coupon.id === couponID);

    if (!coupon) {
      throw new ApiError("Coupon With Given ID Does Not Exist", "BAD_REQUEST");
    }

    return coupon;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Coupon Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default fetchCoupon;
