import OrganizerModel from "@models/organizer.model";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const fetchOrganizer = async (id: string) => {
  try {
    const dbOrganizer = await OrganizerModel.findOne(
      {
        _id: id,
      },
      {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    ).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    const { _id, ...data } = dbOrganizer;

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
      "Unable To Retrieve User Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default fetchOrganizer;
