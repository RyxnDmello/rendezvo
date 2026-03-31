import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedEvents } from "./helpers/redis";

import { CreateEventValidatorSchema } from "@validators/event/createEvent.validator";

import ApiError from "@utils/ApiError";

const createEvent = async (
  ownerID: string,
  data: CreateEventValidatorSchema,
) => {
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
};

export default createEvent;
