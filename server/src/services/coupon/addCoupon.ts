import { Types } from "mongoose";

import { Schedule } from "@schemas/event/schedule.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedCoupons } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import { AddCouponValidatorSchema } from "@validators/coupon/addCoupon.validator";

import ApiError from "@utils/ApiError";

const addCoupon = async (
  eventID: string,
  ownerID: string,
  data: AddCouponValidatorSchema,
) => {
  const [dbEvent, dbOrganizer] = await Promise.all([
    EventModel.findById(eventID, {
      owner: 1,
      tickets: 1,
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

  if (dbEvent.owner.toString() !== ownerID) {
    throw new ApiError(
      "You Are Not Authorized To Add Coupons To This Event",
      "FORBIDDEN",
    );
  }

  if (dbEvent.coupons?.length === 10) {
    throw new ApiError(
      "An Event Can Hold A Maximum Of 10 Coupons",
      "VALIDATION_ERROR",
    );
  }

  if (data.ticketID) {
    if (!dbEvent.tickets || dbEvent.tickets.length === 0) {
      throw new ApiError(
        "Unable To Assign Ticket Since Ticket With Given ID Does Not Exist",
        "VALIDATION_ERROR",
      );
    }

    const exists = dbEvent.tickets?.find(
      (ticket) => ticket.id === data.ticketID,
    );

    if (!exists) {
      throw new ApiError(
        "Unable To Assign Ticket Since Ticket With Given ID Does Not Exist",
        "VALIDATION_ERROR",
      );
    }
  }

  const exists = dbEvent.coupons?.find(
    (coupon) => coupon.name.toLowerCase() === data.name.toLowerCase(),
  );

  if (exists) {
    throw new ApiError(
      "Coupon With Given Name Already Exists",
      "VALIDATION_ERROR",
    );
  }

  validateSchedule(dbEvent.schedule, data.schedule);

  const newCoupons = dbEvent.coupons ?? [];

  newCoupons.push({
    ...data,
    id: new Types.ObjectId().toString(),
    ticketID: data.ticketID ?? null,
    pricing: {
      ...data.pricing,
      limit: data.pricing.limit ?? null,
    },
    quantity: {
      ...data.quantity,
      used: 0,
      remaining: data.quantity.total,
    },
    schedule: {
      ...data.schedule,
      startDate: new Date(data.schedule.startDate),
      endDate: new Date(data.schedule.endDate),
    },
  });

  const coupons = newCoupons.sort((a, b) => {
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
      _id: eventID,
    },
    {
      $set: {
        coupons,
      },
    },
    {
      runValidators: true,
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Add Coupon Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  await Promise.all([
    clearCachedEvents(ownerID),
    clearCachedEvent(eventID, ownerID),
    clearCachedCoupons(eventID, ownerID),
  ]);

  return {
    success: true,
  };
};

const validateSchedule = (
  eventSchedule: Schedule,
  couponSchedule: AddCouponValidatorSchema["schedule"],
) => {
  const couponStartDate = combine(
    new Date(couponSchedule.startDate),
    couponSchedule.startTime,
  );

  const couponEndDate = combine(
    new Date(couponSchedule.endDate),
    couponSchedule.endTime,
  );

  if (eventSchedule.type === "custom") {
    const dates = eventSchedule.dates!;

    const eventStartDate = new Date(dates[0]!);
    const eventEndDate = new Date(dates[dates.length - 1]!);

    if (couponStartDate > eventStartDate) {
      throw new ApiError(
        "Coupon Sales Start Date Must Be Set Before The Event Start Date",
        "VALIDATION_ERROR",
      );
    }

    if (couponEndDate > eventEndDate) {
      throw new ApiError(
        "Coupon Sales End Date Must Be Set Before The Event End Date",
        "VALIDATION_ERROR",
      );
    }

    return;
  }

  if (!eventSchedule.slots) {
    const eventStartDate = combine(
      eventSchedule.startDate!,
      eventSchedule.startTime!,
    );

    const eventEndDate = combine(
      eventSchedule.endDate!,
      eventSchedule.endTime!,
    );

    if (couponStartDate > eventStartDate) {
      throw new ApiError(
        "Coupon Sales Start Date Must Be Set Before The Event Start Date",
        "VALIDATION_ERROR",
      );
    }

    if (couponEndDate > eventEndDate) {
      throw new ApiError(
        "Coupon Sales End Date Must Be Set Before The Event End Date",
        "VALIDATION_ERROR",
      );
    }

    return;
  }

  const eventStartDate = combine(
    eventSchedule.startDate!,
    eventSchedule.slots[0]!.startTime,
  );

  const eventEndDate = combine(
    eventSchedule.endDate!,
    eventSchedule.slots[eventSchedule.slots.length - 1]!.endTime,
  );

  if (couponStartDate > eventStartDate) {
    throw new ApiError(
      "Coupon Sales Start Date Must Be Set Before The Event Start Date",
      "VALIDATION_ERROR",
    );
  }

  if (couponEndDate > eventEndDate) {
    throw new ApiError(
      "Coupon Sales End Date Must Be Set Before The Event End Date",
      "VALIDATION_ERROR",
    );
  }
};

const combine = (date: Date, time: String) => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h!, m!, 0, 0);
  return d;
};

export default addCoupon;
