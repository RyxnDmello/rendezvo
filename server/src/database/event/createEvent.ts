import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedEvents } from "./helpers/redis";

import { CreateEventValidatorSchema } from "@validators/event/createEvent.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const createEvent = async (
  ownerID: string,
  data: CreateEventValidatorSchema,
) => {
  try {
    const dbOrganizer = await OrganizerModel.exists({
      _id: ownerID,
    });

    if (!dbOrganizer) {
      throw new ApiError("Owner With Given ID Does Not Exist", "BAD_REQUEST");
    }

    const newEvent = new EventModel({
      ...data,
      owner: ownerID,
    });

    await newEvent.save();

    await clearCachedEvents(ownerID);

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
      "Unable To Create A New Event Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default createEvent;
