import EventModel, { Event } from "@models/event.model";

import { getCachedEvent, setCachedEvent } from "./helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that retrieves an organizer's event.
 *
 * This function attempts to fetch the event from cache. If not found,
 * it retrieves the event from the database and caches the result.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The event data.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if access is not authorized.
 */
const fetchEvent = async (id: string, ownerID: string) => {
  const event =
    (await getCachedEvent(id, ownerID)) ?? (await getEvent(id, ownerID));

  return event as Event;
};

/**
 * A service helper function that retrieves an organizer's event from the database.
 *
 * This function validates event existence and access permissions,
 * transforms the response, and stores it in cache.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The event data.
 *
 * @throws
 * - An ApiError if event does not exist.
 * - An ApiError if access is not authorized.
 */
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
