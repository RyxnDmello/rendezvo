import EventModel, { Event } from "@models/event.model";

import { FetchEventsValidatorSchema } from "@validators/event/fetchEvents.validator";

import { getCachedEvents, setCachedEvents } from "./helpers/redis";

type Filter = {
  owner: string;
  mode?: string;
  status?: string;
  visibility?: string;
  attendance?: string;
  approved?: boolean;
  name?: {
    $regex: string;
    $options: "i";
  };
};

/**
 * A service function that retrieves multiple events of an organizer.
 *
 * This function builds a filter based on query parameters. It uses
 * cache when no filters are applied, otherwise queries the database.
 *
 * @param {string} owner - The ID of the organizer.
 * @param {FetchEventsValidatorSchema} query - The validated query parameters.
 * @param {number} [limit=0] - The maximum number of events to retrieve.
 *
 * @returns A list of events.
 */
const fetchEvents = async (
  owner: string,
  query: FetchEventsValidatorSchema,
  limit: number = 0,
) => {
  let cacheable = true;

  const filter: Filter = {
    owner,
  };

  if (query.mode !== undefined) {
    filter.mode = query.mode;
    cacheable = false;
  }

  if (query.status !== undefined) {
    filter.status = query.status;
    cacheable = false;
  }

  if (query.visibility !== undefined) {
    filter.visibility = query.visibility;
    cacheable = false;
  }

  if (query.attendance !== undefined) {
    filter.attendance = query.attendance;
    cacheable = false;
  }

  if (query.approved !== undefined) {
    filter.approved = query.approved;
    cacheable = false;
  }

  if (query.name !== undefined) {
    filter.name = {
      $regex: query.name,
      $options: "i",
    };

    cacheable = false;
  }

  if (cacheable) {
    const events =
      (await getCachedEvents(owner)) ??
      (await getEvents(filter, limit, cacheable));

    return events as Event[];
  }

  return await getEvents(filter, limit, false);
};

/**
 * A service helper function that retrieves events or an organizer, from the database.
 *
 * This function executes the database query, transforms
 * the results, and optionally stores them in cache.
 *
 * @param {Filter} filter - The query filter.
 * @param {number} limit - The maximum number of events to retrieve.
 * @param {boolean} cacheable - Indicates if results should be cached.
 *
 * @returns A list of events.
 */
const getEvents = async (filter: Filter, limit: number, cacheable: boolean) => {
  const dbEvents = await EventModel.find(filter, {
    createdAt: 0,
    updatedAt: 0,
  })
    .lean({
      versionKey: false,
    })
    .limit(limit);

  const events = dbEvents.map((event) => {
    const { _id, ...data } = event;

    return {
      id: _id.toString(),
      ...data,
    };
  });

  if (cacheable) {
    setCachedEvents(filter.owner, events);
  }

  return events;
};

export default fetchEvents;
