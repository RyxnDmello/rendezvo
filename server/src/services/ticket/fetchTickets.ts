import { Ticket } from "@schemas/event/ticket.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { getCachedTickets, setCachedTickets } from "./helpers/redis";

import ApiError from "@utils/ApiError";

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
