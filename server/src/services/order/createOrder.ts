import { startSession } from "mongoose";

import UserModel from "@models/user.model";
import EventModel from "@models/event.model";
import OrderModel from "@models/order.model";

import { EventTicket } from "@schemas/event/ticket.schema";
import { EventCoupon } from "@schemas/event/coupon.schema";
import { OrderTicket } from "@schemas/order/ticket.schema";
import { OrderCoupon } from "@schemas/order/coupon.schema";
import { OrderPricing } from "@schemas/order/pricing.schema";

import { CreateOrderValidatorSchema } from "@validators/order/createOrder.validator";

import validateSchedule from "./validators/validateSchedule";

import ApiError from "@utils/ApiError";

/**
 * A service function that creates an order for an event, under a user.
 *
 * This function validates the user's and event's existence, validates the
 * order schedule, builds the order tickets, coupons, and pricing. It updates
 * the event document with the updated ticket and coupon details, and creates
 * a new order document for that event, under the user.
 *
 * @param userID - The ID of the user.
 * @param data - The validated create order payload.
 *
 * @returns A success response if the order is created.
 *
 * @throws
 * - An ApiError if user does not exist.
 * - An ApiError if event does not exist.
 * - An ApiError if event is not approved or status is inactive.
 * - An ApiError if event is not updated.
 */
const createOrder = async (
  userID: string,
  data: CreateOrderValidatorSchema,
) => {
  const [dbUser, dbEvent] = await Promise.all([
    UserModel.exists({
      _id: userID,
    }),
    await EventModel.findById(data.eventID, {
      owner: 1,
      status: 1,
      approved: 1,
      tickets: 1,
      coupons: 1,
      schedule: 1,
    }).lean({
      versionKey: false,
    }),
  ]);

  if (!dbUser) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (!dbEvent) {
    throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (!dbEvent.approved || dbEvent.status === "inactive") {
    throw new ApiError(
      "Event With Given ID Cannot Accept Orders At The Moment",
      "BAD_REQUEST",
    );
  }

  validateSchedule(data.schedule, dbEvent.schedule);

  const { tickets, updatedEventTickets } = buildTickets(
    data.tickets,
    dbEvent.tickets as EventTicket[],
  );

  const { coupons, updatedEventCoupons } = buildCoupons(
    data.coupons,
    dbEvent.coupons as EventCoupon[],
    dbEvent.tickets as EventTicket[],
  );

  const pricing = buildPricing(tickets, coupons ?? undefined);

  const session = await startSession();

  try {
    await session.withTransaction(async () => {
      const updatedEvent = await EventModel.updateOne(
        {
          _id: dbEvent._id,
        },
        {
          $set: {
            tickets: updatedEventTickets,
            coupons: updatedEventCoupons ?? undefined,
          },
        },
        {
          session,
          runValidators: true,
        },
      );

      if (!updatedEvent.acknowledged || updatedEvent.modifiedCount !== 1) {
        throw new ApiError(
          "Failed To Create An Order Due To An Expected Server Error",
          "INTERNAL_SERVER_ERROR",
        );
      }

      const newOrder = new OrderModel({
        user: userID,
        owner: dbEvent.owner,
        event: dbEvent._id,
        status: "open",
        tickets,
        coupons,
        pricing,
        schedule: data.schedule,
      });

      await newOrder.save({ session });
    });

    return {
      success: true,
    };
  } finally {
    await session.endSession();
  }
};

const buildTickets = (
  orderTickets: CreateOrderValidatorSchema["tickets"],
  eventTickets: EventTicket[],
) => {
  const tickets: OrderTicket[] = [];

  const eventTicketsMap = new Map(
    eventTickets.map((ticket) => [ticket.id, ticket]),
  );

  for (const orderTicket of orderTickets) {
    const eventTicket = eventTicketsMap.get(orderTicket.ticketID);

    if (!eventTicket) {
      throw new ApiError(
        "An Invalid Ticket ID Has Been Provided",
        "BAD_REQUEST",
      );
    }

    if (eventTicket.quantity.remaining < orderTicket.quantity) {
      throw new ApiError(
        "One Or More Tickets Have An Insufficient Number Of Seats",
        "BAD_REQUEST",
      );
    }

    eventTicket.quantity.sold += orderTicket.quantity;
    eventTicket.quantity.remaining -= orderTicket.quantity;

    const ticket: OrderTicket = {
      ticketID: orderTicket.ticketID,
      quantity: orderTicket.quantity,
      pricing: {
        entry: 0,
        cover: 0,
        total: 0,
      },
    };

    ticket.pricing.entry = orderTicket.quantity * eventTicket.pricing.entry;
    ticket.pricing.cover = orderTicket.quantity * eventTicket.pricing.cover;
    ticket.pricing.total = ticket.pricing.entry + ticket.pricing.cover;

    tickets.push(ticket);
  }

  return {
    tickets,
    updatedEventTickets: Array.from(eventTicketsMap.values()),
  };
};

const buildCoupons = (
  orderCoupons: CreateOrderValidatorSchema["coupons"] | undefined,
  eventCoupons: EventCoupon[] | undefined,
  eventTickets: EventTicket[],
) => {
  if (!orderCoupons || !eventCoupons) {
    return {
      coupons: null,
      updatedEventCoupons: null,
    };
  }

  const coupons: OrderCoupon[] = [];

  const eventCouponsMap = new Map(
    eventCoupons
      .filter((coupon) => coupon.active)
      .map((coupon) => [coupon.id, coupon]),
  );

  const eventTicketsMap = new Map(
    eventTickets
      .filter((ticket) => ticket.active)
      .map((ticket) => [ticket.id, ticket]),
  );

  for (const orderCoupon of orderCoupons) {
    const eventCoupon = eventCouponsMap.get(orderCoupon);

    if (!eventCoupon) {
      throw new ApiError(
        "An Invalid Coupon ID Has Been Provided",
        "BAD_REQUEST",
      );
    }

    if (eventCoupon.quantity.remaining === 0) {
      throw new ApiError(
        "One Or More Coupons Have Been Sold Out",
        "BAD_REQUEST",
      );
    }

    if (eventCoupon.ticketID && !eventTicketsMap.get(eventCoupon.ticketID)) {
      throw new ApiError(
        "One Or More Coupons Cannot Be Applied To This Order",
        "VALIDATION_ERROR",
      );
    }

    eventCoupon.quantity.used += 1;
    eventCoupon.quantity.remaining -= 1;

    const coupon: OrderCoupon = {
      couponID: orderCoupon,
      pricing: {
        type: eventCoupon.pricing.type,
        amount: eventCoupon.pricing.amount,
        limit: eventCoupon.pricing.limit,
      },
    };

    coupons.push(coupon);
  }

  return {
    coupons,
    updatedEventCoupons: Array.from(eventCouponsMap.values()),
  };
};

const buildPricing = (tickets: OrderTicket[], coupons?: OrderCoupon[]) => {
  const pricing: OrderPricing = {
    entry: 0,
    cover: 0,
    total: 0,
    discount: 0,
  };

  const { entry, cover, total } = tickets.reduce(
    (acc, curr) => {
      acc.entry += curr.pricing.entry;
      acc.cover += curr.pricing.cover;
      acc.total = acc.entry + acc.cover;
      return acc;
    },
    {
      entry: 0,
      cover: 0,
      total: 0,
      discount: 0,
    },
  );

  pricing.entry = entry;
  pricing.cover = cover;
  pricing.total = total;

  if (!coupons) return pricing;

  for (const coupon of coupons) {
    switch (coupon.pricing.type) {
      case "fixed":
        pricing.discount += coupon.pricing.amount;
        break;
      case "percentage":
        const discount = coupon.pricing.amount * 0.01 * pricing.total;

        if (discount > coupon.pricing.limit!) {
          pricing.discount += coupon.pricing.limit!;
          break;
        }

        pricing.discount += discount;
        break;
    }
  }

  pricing.total -= pricing.discount;

  return pricing;
};

export default createOrder;
