import EventModel from "@models/event.model";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const fetchEvent = async (id: string) => {
  try {
    const dbEvent = await EventModel.findById(id, {
      createdAt: 0,
      updatedAt: 0,
    }).lean({
      versionKey: false,
    });

    if (!dbEvent) {
      throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
    }

    const { _id, ...data } = dbEvent;

    return {
      id: _id,
      ...data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Event Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default fetchEvent;
