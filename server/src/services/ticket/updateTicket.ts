import { Schedule } from "@schemas/event/schedule.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedTicket, clearCachedTickets } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import { UpdateTicketValidatorSchema } from "@validators/ticket/updateTicket.validator";

import ApiError from "@utils/ApiError";

/**
 * A service function that updates a ticket in an event's ticket list.
 *
 * This function validates the event's existence and the organizer's authorization.
 * It ensures the ticket exists and applies updates based on the specified action.
 * It validates constraints such as name uniqueness, quantity rules, and schedule
 * validity. It updates the event and clears related cache.
 *
 * @param {string} id - The ID of the ticket.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {UpdateTicketValidatorSchema} data - The validated update ticket payload.
 *
 * @returns A success response if the ticket is updated.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if event has no tickets.
 * - An ApiError if ticket does not exist.
 * - An ApiError if ticket name already exists.
 * - An ApiError if quantity constraints fail.
 * - An ApiError if schedule validation fails.
 * - An ApiError if database update fails.
 */
const updateTicket = async (
  id: string,
  eventID: string,
  ownerID: string,
  data: UpdateTicketValidatorSchema,
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
      "You Are Not Authorized To Update Tickets For This Event",
      "FORBIDDEN",
    );
  }

  if (!dbEvent.tickets || dbEvent.tickets.length === 0) {
    throw new ApiError("Event With Given ID Has No Tickets", "BAD_REQUEST");
  }

  const index = dbEvent.tickets.findIndex((ticket) => ticket.id === id);

  if (index === -1) {
    throw new ApiError("Ticket With Given ID Does Not Exist", "BAD_REQUEST");
  }

  const dbTicket = dbEvent.tickets[index]!;

  const { action, ...ticket } = data;

  if (action === "basic") {
    if (ticket.name) {
      const exists = dbEvent.tickets?.find((dbTicket) => {
        return dbTicket.name.toLowerCase() === ticket.name!.toLowerCase();
      });

      if (exists) {
        throw new ApiError(
          "Ticket With Given Name Already Exists",
          "VALIDATION_ERROR",
        );
      }

      dbTicket.name = ticket.name;
    }

    dbTicket.description = ticket.description ?? dbTicket.description;
  }

  if (action === "pricing") {
    dbTicket.pricing = {
      entry: ticket.pricing!.entry,
      cover: ticket.pricing!.cover,
      total: ticket.pricing!.entry + ticket.pricing!.cover,
    };
  }

  if (action === "quantity") {
    const increment = ticket.quantity!.total - dbTicket.quantity.total;

    if (increment < 1) {
      throw new ApiError(
        "Ticket Quantity Must Be Greater Than The Current Quantity",
        "BAD_REQUEST",
      );
    }

    dbTicket.quantity = {
      ...dbTicket.quantity,
      total: dbTicket.quantity.total + increment,
      remaining: dbTicket.quantity.remaining + increment,
    };
  }

  if (action === "schedule") {
    validateSchedule(dbEvent.schedule, data.schedule);

    dbTicket.schedule = {
      ...data.schedule!,
      startDate: new Date(data.schedule!.startDate),
      endDate: new Date(data.schedule!.endDate),
    };
  }

  const tickets = dbEvent.tickets.sort((a, b) => {
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
      "Unable To Update Ticket Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  await Promise.all([
    clearCachedEvents(ownerID),
    clearCachedEvent(eventID, ownerID),
    clearCachedTickets(eventID, ownerID),
    clearCachedTicket(id, eventID, ownerID),
  ]);

  return {
    success: true,
  };
};

const validateSchedule = (
  eventSchedule: Schedule,
  ticketSchedule: UpdateTicketValidatorSchema["schedule"],
) => {
  const ticketStartDate = combine(
    new Date(ticketSchedule!.startDate),
    ticketSchedule!.startTime,
  );

  const ticketEndDate = combine(
    new Date(ticketSchedule!.endDate),
    ticketSchedule!.endTime,
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

export default updateTicket;
