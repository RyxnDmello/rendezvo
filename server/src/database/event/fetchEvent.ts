import EventModel, { Event } from "@models/event.model";

import { getCachedEvent, setCachedEvent } from "./helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const fetchEvent = async (id: string, ownerID: string) => {
  try {
    return (
      ((await getCachedEvent(id, ownerID)) as unknown as Event) ??
      (await getEvent(id, ownerID))
    );
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Event Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

const getEvent = async (id: string, ownerID: string) => {
  const dbEvent = await EventModel.findById(id, {
    createdAt: 0,
    updatedAt: 0,
  }).lean({
    versionKey: false,
  });

  if (!dbEvent) {
    throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (dbEvent.owner.toString() !== ownerID) {
    throw new ApiError(
      "You Are Not Authorized To Retrieve This Event",
      "FORBIDDEN",
    );
  }

  const { _id, ...data } = dbEvent;

  const event = {
    id,
    ...data,
  };

  await setCachedEvent(id, ownerID, event);

  return event;
};

export default fetchEvent;
