import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedTicket, clearCachedTickets } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@services/event/helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that deletes a ticket from an event's ticket list.
 *
 * This function validates the event's existence and the organizer's authorization.
 * It ensures the ticket exists, is inactive, and has no sold quantity. It removes
 * the ticket from the event and clears related cache.
 *
 * @param {string} id - The ID of the ticket.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns A success response if the ticket is deleted.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if event has no tickets.
 * - An ApiError if ticket does not exist.
 * - An ApiError if ticket is active.
 * - An ApiError if tickets have been sold.
 * - An ApiError if database update fails.
 */
const deleteTicket = async (id: string, eventID: string, ownerID: string) => {
  const [dbEvent, dbOrganizer] = await Promise.all([
    EventModel.findById(eventID, {
      owner: 1,
      tickets: 1,
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
      "You Are Not Authorized To Delete Tickets For This Event",
      "FORBIDDEN",
    );
  }

  if (!dbEvent.tickets || dbEvent.tickets.length === 0) {
    throw new ApiError("Event With Given ID Has No Tickets", "BAD_REQUEST");
  }

  const ticket = dbEvent.tickets.find((ticket) => ticket.id === id);

  if (!ticket) {
    throw new ApiError("Ticket With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (ticket.active) {
    throw new ApiError(
      "Ticket Must Be Set As Inactive Before Deletion",
      "BAD_REQUEST",
    );
  }

  if (ticket.quantity.sold !== 0) {
    throw new ApiError(
      "Ticket Cannot Be Deleted Since Tickets Have Been Sold",
      "BAD_REQUEST",
    );
  }

  const { acknowledged, modifiedCount } = await EventModel.updateOne(
    {
      _id: eventID,
    },
    {
      $pull: {
        tickets: {
          id: id,
        },
      },
    },
    {
      runValidators: true,
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Delete Ticket Due To Server Error",
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

export default deleteTicket;
