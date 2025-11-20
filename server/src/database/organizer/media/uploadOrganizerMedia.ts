import OrganizerModel from "@models/organizer.model";

import { UploadOrganizerMediaValidatorSchema } from "@validators/organizer/media/uploadOrganizerMedia.validator";

import {
  uploadBanner,
  updateBanner,
  uploadProfile,
  updateProfile,
} from "../helpers/storage";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const uploadOrganizerMedia = async (
  id: string,
  data: UploadOrganizerMediaValidatorSchema
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

    const [profileID, bannerID] = await Promise.all([
      dbOrganizer.profile?.image
        ? updateProfile(id, data.profile)
        : uploadProfile(id, data.profile),
      dbOrganizer.profile?.banner
        ? updateBanner(id, data.banner)
        : uploadBanner(id, data.banner),
    ]);

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
            banner: {
              id: bannerID,
              type: "image",
            },
          },
        },
      },
      {
        runValidators: true,
      }
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Upload Media Due To Server Error",
        "INTERNAL_SERVER_ERROR"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Upload Media Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default uploadOrganizerMedia;
