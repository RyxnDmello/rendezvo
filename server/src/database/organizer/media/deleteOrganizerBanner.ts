import OrganizerModel from "@models/organizer.model";

import { deleteBanner } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const deleteOrganizerBanner = async (id: string) => {
  try {
    const dbOrganizer = await OrganizerModel.findById(id, {
      profile: 1,
    }).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbOrganizer.profile?.banner) {
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
              banner: null,
            },
          },
        },
        {
          runValidators: true,
        },
      ),
      deleteBanner(id),
    ]);

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Delete Banner Image Due To Server Error",
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
      "Unable To Delete Banner Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default deleteOrganizerBanner;
