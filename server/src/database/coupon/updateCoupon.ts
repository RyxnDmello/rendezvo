import { Schedule } from "@schemas/event/schedule.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { UpdateCouponValidatorSchema } from "@validators/coupon/updateCoupon.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const updateCoupon = async (
  id: string,
  couponID: string,
  ownerID: string,
  data: UpdateCouponValidatorSchema
) => {
  try {
    const [dbEvent, dbOrganizer] = await Promise.all([
      EventModel.findById(id, {
        ownerID: 1,
        coupons: 1,
        schedule: 1,
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
        "You Are Not Authorized To Update Coupons For This Event",
        "FORBIDDEN"
      );
    }

    if (!dbEvent.coupons || dbEvent.coupons.length === 0) {
      throw new ApiError("Event With Given ID Has No Coupons", "BAD_REQUEST");
    }

    const index = dbEvent.coupons.findIndex((coupon) => coupon.id === couponID);

    if (index === -1) {
      throw new ApiError("Coupon With Given ID Does Not Exist", "BAD_REQUEST");
    }

    const dbCoupon = dbEvent.coupons[index]!;

    const { action, ...coupon } = data;

    if (action === "basic") {
      if (coupon.name) {
        const exists = dbEvent.coupons?.find((dbCoupon) => {
          return dbCoupon.name.toLowerCase() === coupon.name!.toLowerCase();
        });

        if (exists) {
          throw new ApiError(
            "Coupon With Given Name Already Exists",
            "VALIDATION_ERROR"
          );
        }

        dbCoupon.name = coupon.name;
      }

      dbCoupon.description = coupon.description ?? dbCoupon.description;
    }

    if (action === "pricing") {
      dbCoupon.pricing = {
        ...coupon.pricing!,
        limit: coupon.pricing!.limit ?? null,
      };
    }

    if (action === "quantity") {
      const increment = coupon.quantity!.total - dbCoupon.quantity.total;

      if (increment < 1) {
        throw new ApiError(
          "Coupon Quantity Must Be Greater Than The Current Quantity",
          "BAD_REQUEST"
        );
      }

      dbCoupon.quantity = {
        ...dbCoupon.quantity,
        total: dbCoupon.quantity.total + increment,
        remaining: dbCoupon.quantity.remaining + increment,
      };
    }

    if (action === "schedule") {
      validateSchedule(dbEvent.schedule, data.schedule);

      dbCoupon.schedule = {
        ...data.schedule!,
        startDate: new Date(data.schedule!.startDate),
        endDate: new Date(data.schedule!.endDate),
      };
    }

    const coupons = dbEvent.coupons.sort((a, b) => {
      if (a.pricing.type !== b.pricing.type) {
        return a.pricing.type === "fixed" ? -1 : 1;
      }

      if (a.pricing.amount !== b.pricing.amount) {
        return a.pricing.amount - b.pricing.amount;
      }

      if (a.pricing.type === "percentage") {
        return (a.pricing.limit ?? 0) - (b.pricing.limit ?? 0);
      }

      if (a.type !== b.type) {
        return a.type === "general" ? -1 : 1;
      }

      return 0;
    });

    const { acknowledged, modifiedCount } = await EventModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          coupons,
        },
      },
      {
        runValidators: true,
      }
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Update Coupon Due To Server Error",
        "INTERNAL_SERVER_ERROR"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Update Coupon Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

const validateSchedule = (
  eventSchedule: Schedule,
  couponSchedule: UpdateCouponValidatorSchema["schedule"]
) => {
  const couponStartDate = combine(
    new Date(couponSchedule!.startDate),
    couponSchedule!.startTime
  );

  const couponEndDate = combine(
    new Date(couponSchedule!.endDate),
    couponSchedule!.endTime
  );

  if (eventSchedule.type === "custom") {
    const dates = eventSchedule.dates!;

    const eventStartDate = new Date(dates[0]!);
    const eventEndDate = new Date(dates[dates.length - 1]!);

    if (couponStartDate > eventStartDate) {
      throw new ApiError(
        "Ticket Sales Start Date Must Be Set Before The Event Start Date",
        "VALIDATION_ERROR"
      );
    }

    if (couponEndDate > eventEndDate) {
      throw new ApiError(
        "Ticket Sales End Date Must Be Set Before The Event End Date",
        "VALIDATION_ERROR"
      );
    }

    return;
  }

  if (!eventSchedule.slots) {
    const eventStartDate = combine(
      eventSchedule.startDate!,
      eventSchedule.startTime!
    );

    const eventEndDate = combine(
      eventSchedule.endDate!,
      eventSchedule.endTime!
    );

    if (couponStartDate > eventStartDate) {
      throw new ApiError(
        "Ticket Sales Start Date Must Be Set Before The Event Start Date",
        "VALIDATION_ERROR"
      );
    }

    if (couponEndDate > eventEndDate) {
      throw new ApiError(
        "Ticket Sales End Date Must Be Set Before The Event End Date",
        "VALIDATION_ERROR"
      );
    }

    return;
  }

  const eventStartDate = combine(
    eventSchedule.startDate!,
    eventSchedule.slots[0]!.startTime
  );

  const eventEndDate = combine(
    eventSchedule.endDate!,
    eventSchedule.slots[eventSchedule.slots.length - 1]!.endTime
  );

  if (couponStartDate > eventStartDate) {
    throw new ApiError(
      "Ticket Sales Start Date Must Be Set Before The Event Start Date",
      "VALIDATION_ERROR"
    );
  }

  if (couponEndDate > eventEndDate) {
    throw new ApiError(
      "Ticket Sales End Date Must Be Set Before The Event End Date",
      "VALIDATION_ERROR"
    );
  }
};

const combine = (date: Date, time: String) => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h!, m!, 0, 0);
  return d;
};

export default updateCoupon;
