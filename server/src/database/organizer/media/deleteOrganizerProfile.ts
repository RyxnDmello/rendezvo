import OrganizerModel from "@models/organizer.model";

import { deleteProfile } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const deleteOrganizerProfile = async (id: string) => {
  try {
    const dbOrganizer = await OrganizerModel.findById(id, {
      profile: 1,
    }).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbOrganizer.profile?.image) {
      return {
        success: true,
      };
    }

    const [{ acknowledged, modifiedCount }, _] = await Promise.all([
      OrganizerModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            profile: {
              ...dbOrganizer.profile,
              image: null,
            },
          },
        },
        {
          runValidators: true,
        },
      ),
      deleteProfile(id),
    ]);

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Delete Profile Image Due To Server Error",
        "INTERNAL_SERVER_ERROR",
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isAppwriteError(error)) {
      throw new AppwriteError(error);
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Delete Profile Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default deleteOrganizerProfile;
