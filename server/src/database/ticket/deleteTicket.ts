import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedTicket, clearCachedTickets } from "./helpers/redis";

import {
  clearCachedEvent,
  clearCachedEvents,
} from "@database/event/helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const deleteTicket = async (id: string, eventID: string, ownerID: string) => {
  try {
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
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Delete Ticket Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default deleteTicket;
