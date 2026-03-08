import OrganizerModel from "@models/organizer.model";

import { UploadOrganizerProfileValidatorSchema } from "@validators/organizer/media/uploadOrganizerProfile.validator";

import { uploadProfile, updateProfile } from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import AppwriteError, { isAppwriteError } from "@utils/AppwriteError";
import ApiError, { isApiError } from "@utils/ApiError";

const uploadOrganizerProfile = async (
  id: string,
  data: UploadOrganizerProfileValidatorSchema,
) => {
  try {
    const dbOrganizer = await OrganizerModel.findById(id, {
      profile: 1,
    }).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    const profileID = dbOrganizer.profile?.image
      ? await updateProfile(id, data.profile)
      : await uploadProfile(id, data.profile);

    const { acknowledged, modifiedCount } = await OrganizerModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          profile: {
            ...dbOrganizer.profile,
            image: {
              id: profileID,
              type: "image",
            },
          },
        },
      },
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Upload Profile Image Due To Server Error",
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
      "Unable To Upload Profile Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default uploadOrganizerProfile;
