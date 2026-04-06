import { Types } from "mongoose";

import { EventSchedule } from "@schemas/event/schedule.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedCoupons } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import { AddCouponValidatorSchema } from "@validators/coupon/addCoupon.validator";

import { getCombinedDate } from "./helpers/date";

import ApiError from "@utils/ApiError";

/**
 * A service function that adds a coupon to an event's coupon list.
 *
 * This function validates the event's existence and the organizer's authorization.
 * It ensures coupon limits and uniqueness constraints are satisfied. It validates
 * the coupon schedule against the event's schedule. It optionally validates the
 * associated ticket. It creates and sorts the new coupon, updates the event,
 * and clears related cache.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {AddCouponValidatorSchema} data - The validated coupon payload.
 *
 * @returns A success response if the coupon is added.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if coupon limit is exceeded.
 * - An ApiError if associated ticket is invalid.
 * - An ApiError if coupon with same name already exists.
 * - An ApiError if schedule validation fails.
 * - An ApiError if database update fails.
 */
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
  eventSchedule: EventSchedule[],
  couponSchedule: AddCouponValidatorSchema["schedule"],
) => {
  const ticketStartDate = getCombinedDate(
    new Date(couponSchedule.startDate),
    couponSchedule.startTime,
  );

  const ticketEndDate = getCombinedDate(
    new Date(couponSchedule.endDate),
    couponSchedule.endTime,
  );

  const eventStartDate = getCombinedDate(
    new Date(eventSchedule[0]!.date),
    eventSchedule[0]!.slots[0]!.startTime,
  );

  const eventEndDate = getCombinedDate(
    new Date(eventSchedule[eventSchedule.length - 1]!.date),
    eventSchedule[eventSchedule.length - 1]!.slots[eventSchedule.length - 1]!
      .endTime,
  );

  if (ticketStartDate > eventStartDate) {
    throw new ApiError(
      "Ticket Sales Start Date Must Be Set Before The Event Start Date",
      "VALIDATION_ERROR",
    );
  }

  if (ticketEndDate > eventEndDate) {
    throw new ApiError(
      "Ticket Sales End Date Must Be Set Before The Event End Date",
      "VALIDATION_ERROR",
    );
  }
};

export default addCoupon;
