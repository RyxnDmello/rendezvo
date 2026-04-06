import { Types } from "mongoose";

import { EventSchedule } from "@schemas/event/schedule.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedTickets } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import { AddTicketValidatorSchema } from "@validators/ticket/addTicket.validator";

import { getCombinedDate } from "./helpers/date";

import ApiError from "@utils/ApiError";

/**
 * A service function that adds a ticket to an event's ticket list.
 *
 * This function validates the event's existence and the organizer's authorization.
 * It ensures ticket limits and uniqueness constraints are satisfied. It validates
 * the ticket schedule against the event's schedule. It creates and sorts the new
 * ticket, updates the event, and clears related cache.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {AddTicketValidatorSchema} data - The validated ticket payload.
 *
 * @returns A success response if the ticket is added.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if ticket limit is exceeded.
 * - An ApiError if ticket with same name already exists.
 * - An ApiError if schedule validation fails.
 * - An ApiError if database update fails.
 */
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
  eventSchedule: EventSchedule[],
  ticketSchedule: AddTicketValidatorSchema["schedule"],
) => {
  const ticketStartDate = getCombinedDate(
    new Date(ticketSchedule.startDate),
    ticketSchedule.startTime,
  );

  const ticketEndDate = getCombinedDate(
    new Date(ticketSchedule.endDate),
    ticketSchedule.endTime,
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

export default addTicket;
