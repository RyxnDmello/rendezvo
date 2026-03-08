import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedTicket, clearCachedTickets } from "./helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const toggleTicket = async (id: string, eventID: string, ownerID: string) => {
  try {
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
        "You Are Not Authorized To Toggle Tickets For This Event",
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

    dbEvent.tickets[index]!.active = !dbEvent.tickets[index]!.active;

    const { acknowledged, modifiedCount } = await EventModel.updateOne(
      {
        _id: eventID,
      },
      {
        $set: {
          tickets: dbEvent.tickets,
        },
      },
      {
        runValidators: true,
      },
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Toggle Ticket Due To Server Error",
        "INTERNAL_SERVER_ERROR",
      );
    }

    await Promise.all([
      clearCachedTickets(eventID, ownerID),
      clearCachedTicket(id, eventID, ownerID),
    ]);

    return {
      success: true,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Toggle Ticket Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default toggleTicket;
