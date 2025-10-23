import EventModel from "@models/event.model";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

type Query = {
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
  mode?: string,
  status?: string,
  visibility?: string,
  attendance?: string,
  approved?: boolean,
  name?: string,
  limit: number = 0
) => {
  const query: Query = {
    ownerID,
  };

  if (mode !== undefined) {
    query.mode = mode;
  }

  if (status !== undefined) {
    query.status = status;
  }

  if (visibility !== undefined) {
    query.visibility = visibility;
  }

  if (attendance !== undefined) {
    query.attendance = attendance;
  }

  if (approved !== undefined) {
    query.approved = approved;
  }

  if (name !== undefined) {
    query.name = {
      $regex: name,
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
