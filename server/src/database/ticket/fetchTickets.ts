import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { FetchTicketsValidatorSchema } from "@validators/ticket/fetchTickets.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const fetchTickets = async (id: string, query: FetchTicketsValidatorSchema) => {
  try {
    const [dbEvent, dbOrganizer] = await Promise.all([
      EventModel.findById(id, {
        ownerID: 1,
        tickets: 1,
      }).lean({
        versionKey: false,
      }),
      OrganizerModel.exists({
        _id: query.ownerID,
      }),
    ]);

    if (!dbEvent) {
      throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (dbEvent.ownerID !== query.ownerID) {
      throw new ApiError(
        "You Do Not Have The Permission To Make This Request",
        "UNAUTHORIZED"
      );
    }

    return dbEvent.tickets ?? [];
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Tickets Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default fetchTickets;
