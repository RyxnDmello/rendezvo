import { Ticket } from "@schemas/event/ticket.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { getCachedTickets, setCachedTickets } from "./helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that retrieves all tickets from an event's ticket list.
 *
 * This function attempts to fetch tickets from cache first. If not available,
 * it retrieves them from the database. It validates the event's existence and
 * the organizer's authorization. It caches the result for future requests.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The list of tickets.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not authorized.
 */
const fetchTickets = async (eventID: string, ownerID: string) => {
  const tickets =
    (await getCachedTickets(eventID, ownerID)) ??
    (await getTickets(eventID, ownerID));

  return tickets as Ticket[];
};

const getTickets = async (eventID: string, ownerID: string) => {
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

  const tickets = dbEvent.tickets ?? [];

  await setCachedTickets(eventID, ownerID, tickets);

  return tickets;
};

export default fetchTickets;
