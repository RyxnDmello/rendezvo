import EventModel, { Event } from "@models/event.model";

import { FetchEventsValidatorSchema } from "@validators/event/fetchEvents.validator";

import { getCachedEvents, setCachedEvents } from "./helpers/redis";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

type Filter = {
  ownerID: string;
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

const fetchEvents = async (
  ownerID: string,
  query: FetchEventsValidatorSchema,
  limit: number = 0,
) => {
  let cacheable = true;

  const filter: Filter = {
    ownerID,
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

  try {
    if (cacheable) {
      return (
        ((await getCachedEvents(ownerID)) as unknown as Event[]) ??
        (await getEvents(filter, limit, cacheable))
      );
    }

    return await getEvents(filter, limit, false);
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Events Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

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
    setCachedEvents(filter.ownerID, events);
  }

  return events;
};

export default fetchEvents;
