import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { CreateEventValidatorSchema } from "@validators/event/createEvent.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const createEvent = async (data: CreateEventValidatorSchema) => {
  try {
    const dbOrganizer = await OrganizerModel.exists({
      _id: data.ownerID,
    });

    if (!dbOrganizer) {
      throw new ApiError("Owner With Given ID Does Not Exist", "BAD_REQUEST");
    }

    const newEvent = new EventModel(data);

    await newEvent.save();

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Create A New Event Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default createEvent;
