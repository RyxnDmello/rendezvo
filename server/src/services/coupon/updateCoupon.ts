import { EventSchedule } from "@schemas/event/schedule.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedCoupon, clearCachedCoupons } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import { UpdateCouponValidatorSchema } from "@validators/coupon/updateCoupon.validator";

import { getCombinedDate } from "./helpers/date";

import ApiError from "@utils/ApiError";

/**
 * A service function that updates a coupon in an event's coupon list.
 *
 * This function validates the event's existence and the organizer's authorization.
 * It ensures the coupon exists and applies updates based on the specified action.
 * It validates constraints such as name uniqueness, quantity rules, and schedule
 * validity. It updates the event and clears related cache.
 *
 * @param {string} id - The ID of the coupon.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {UpdateCouponValidatorSchema} data - The validated update coupon payload.
 *
 * @returns A success response if the coupon is updated.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if event has no coupons.
 * - An ApiError if coupon does not exist.
 * - An ApiError if coupon name already exists.
 * - An ApiError if quantity constraints fail.
 * - An ApiError if schedule validation fails.
 * - An ApiError if database update fails.
 */
const updateCoupon = async (
  id: string,
  eventID: string,
  ownerID: string,
  data: UpdateCouponValidatorSchema,
) => {
  const [dbEvent, dbOrganizer] = await Promise.all([
    EventModel.findById(eventID, {
      owner: 1,
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
      "You Are Not Authorized To Update Coupons For This Event",
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
          "VALIDATION_ERROR",
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
        "BAD_REQUEST",
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
      "Unable To Update Coupon Due To Server Error",
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

const validateSchedule = (
  eventSchedule: EventSchedule[],
  couponSchedule: UpdateCouponValidatorSchema["schedule"],
) => {
  const ticketStartDate = getCombinedDate(
    new Date(couponSchedule!.startDate),
    couponSchedule!.startTime,
  );

  const ticketEndDate = getCombinedDate(
    new Date(couponSchedule!.endDate),
    couponSchedule!.endTime,
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

export default updateCoupon;
