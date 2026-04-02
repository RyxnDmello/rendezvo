import { Ticket } from "@schemas/event/ticket.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { getCachedTicket, setCachedTicket } from "./helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that retrieves a ticket from an event's ticket list.
 *
 * This function attempts to fetch the ticket from cache first. If not
 * available, it retrieves the ticket from the database. It validates
 * the event's existence and the organizer's authorization. It caches
 * the result for future requests.
 *
 * @param {string} id - The ID of the ticket.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The retrieved ticket.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 * - An ApiError if event has no tickets.
 * - An ApiError if ticket does not exist.
 */
const fetchTicket = async (id: string, eventID: string, ownerID: string) => {
  const ticket =
    (await getCachedTicket(id, eventID, ownerID)) ??
    (await getTicket(id, eventID, ownerID));

  return ticket as Ticket;
};

const getTicket = async (id: string, eventID: string, ownerID: string) => {
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
      "You Are Not Authorized To Access Tickets For This Event",
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

  await setCachedTicket(id, eventID, ownerID, ticket);

  return ticket;
};

export default fetchTicket;
