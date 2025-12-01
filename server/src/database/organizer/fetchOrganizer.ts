import OrganizerModel from "@models/organizer.model";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const fetchOrganizer = async (id: string) => {
  try {
    const dbOrganizer = await OrganizerModel.findById(id, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    }).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbOrganizer.verified) {
      throw new ApiError(
        "Unable To Proceed Since Account Has Not Been Verified",
        "ACCOUNT_LOCKED"
      );
    }

    const { _id, ...data } = dbOrganizer;

    return {
      id: _id,
      ...data,
    };
  } catch (error) {
    if (isApiError(error)) {
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
