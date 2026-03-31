import { Types } from "mongoose";

import { Schedule } from "@schemas/event/schedule.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedTickets } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import { AddTicketValidatorSchema } from "@validators/ticket/addTicket.validator";

import ApiError from "@utils/ApiError";

const addTicket = async (
  eventID: string,
  ownerID: string,
  data: AddTicketValidatorSchema,
) => {
  const [dbEvent, dbOrganizer] = await Promise.all([
    EventModel.findById(eventID, {
      owner: 1,
      tickets: 1,
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
      "You Are Not Authorized To Add Tickets For This Event",
      "FORBIDDEN",
    );
  }

  if (dbEvent.tickets?.length === 20) {
    throw new ApiError(
      "An Event Can Hold A Maximum Of 20 Tickets",
      "VALIDATION_ERROR",
    );
  }

  const exists = dbEvent.tickets?.find(
    (ticket) => ticket.name.toLowerCase() === data.name.toLowerCase(),
  );

  if (exists) {
    throw new ApiError(
      "Ticket With Given Name Already Exists",
      "VALIDATION_ERROR",
    );
  }

  validateSchedule(dbEvent.schedule, data.schedule);

  const newTickets = dbEvent.tickets ?? [];

  newTickets.push({
    ...data,
    id: new Types.ObjectId().toString(),
    pricing: {
      ...data.pricing,
      total: data.pricing.entry + data.pricing.cover,
    },
    quantity: {
      ...data.quantity,
      sold: 0,
      remaining: data.quantity.total,
    },
    schedule: {
      ...data.schedule,
      startDate: new Date(data.schedule.startDate),
      endDate: new Date(data.schedule.endDate),
    },
  });

  const tickets = newTickets.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "free" ? -1 : 1;
    }

    return a.pricing.total - b.pricing.total;
  });

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: eventID,
    },
    {
      $set: {
        tickets,
      },
    },
    {
      runValidators: true,
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Add Ticket Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  await Promise.all([
    clearCachedEvents(ownerID),
    clearCachedEvent(eventID, ownerID),
    clearCachedTickets(eventID, ownerID),
  ]);

  return {
    success: true,
  };
};

const validateSchedule = (
  eventSchedule: Schedule,
  ticketSchedule: AddTicketValidatorSchema["schedule"],
) => {
  const ticketStartDate = combine(
    new Date(ticketSchedule.startDate),
    ticketSchedule.startTime,
  );

  const ticketEndDate = combine(
    new Date(ticketSchedule.endDate),
    ticketSchedule.endTime,
  );

  if (eventSchedule.type === "custom") {
    const dates = eventSchedule.dates!;

    const eventStartDate = new Date(dates[0]!);
    const eventEndDate = new Date(dates[dates.length - 1]!);

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

const combine = (date: Date, time: String) => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h!, m!, 0, 0);
  return d;
};

export default addTicket;
