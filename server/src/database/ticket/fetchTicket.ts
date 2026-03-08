import { Ticket } from "@schemas/event/ticket.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { getCachedTicket, setCachedTicket } from "./helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const fetchTicket = async (id: string, eventID: string, ownerID: string) => {
  try {
    return (
      ((await getCachedTicket(id, eventID, ownerID)) as unknown as Ticket) ??
      (await getTicket(id, eventID, ownerID))
    );
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Ticket Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

const getTicket = async (id: string, eventID: string, ownerID: string) => {
  const [dbEvent, dbOrganizer] = await Promise.all([
    EventModel.findById(eventID, {
      ownerID: 1,
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

  if (dbEvent.ownerID !== ownerID) {
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
