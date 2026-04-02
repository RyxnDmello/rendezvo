import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { clearCachedEvents } from "./helpers/redis";

import { CreateEventValidatorSchema } from "@validators/event/createEvent.validator";

import ApiError from "@utils/ApiError";

/**
 * A service function that creates an event under an organizer.
 *
 * This function validates the organizer existence, creates a new event,
 * stores it in the database, and clears related cached data.
 *
 * @param {string} ownerID - The ID of the organizer.
 * @param {CreateEventValidatorSchema} data - The validated create event payload.
 *
 * @returns A success response if the event is created.
 *
 * @throws An ApiError if organizer does not exist.
 */
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
