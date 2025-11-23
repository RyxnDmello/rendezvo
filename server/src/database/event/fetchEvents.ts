import EventModel from "@models/event.model";

import { FetchEventsValidatorSchema } from "@validators/event/fetchEvents.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

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
  query: FetchEventsValidatorSchema,
  limit: number = 0
) => {
  const filter: Filter = {
    ownerID: query.ownerID,
  };

  if (query.mode !== undefined) {
    filter.mode = query.mode;
  }

  if (query.status !== undefined) {
    filter.status = query.status;
  }

  if (query.visibility !== undefined) {
    filter.visibility = query.visibility;
  }

  if (query.attendance !== undefined) {
    filter.attendance = query.attendance;
  }

  if (query.approved !== undefined) {
    filter.approved = query.approved;
  }

  if (query.name !== undefined) {
    filter.name = {
      $regex: query.name,
      $options: "i",
    };
  }

  try {
    const dbEvents = await EventModel.find(query, {
      createdAt: 0,
      updatedAt: 0,
    })
      .lean({
        versionKey: false,
      })
      .limit(limit);

    return dbEvents.map((event) => {
      const { _id, ...data } = event;

      return {
        id: _id,
        ...data,
      };
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Retrieve Events Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default fetchEvents;
