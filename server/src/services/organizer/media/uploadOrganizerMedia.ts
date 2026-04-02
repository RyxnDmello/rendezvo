import OrganizerModel from "@models/organizer.model";

import { UploadOrganizerMediaValidatorSchema } from "@validators/organizer/media/uploadOrganizerMedia.validator";

import {
  uploadBanner,
  updateBanner,
  uploadProfile,
  updateProfile,
} from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that uploads an organizer's profile and banner image.
 *
 * This function checks if the organizer exists. It uploads or updates
 * both profile image and banner in storage and updates the database
 * with new media references.
 *
 * @param {string} id - The ID of the organizer.
 * @param {UploadOrganizerMediaValidatorSchema} data - The validated upload media payload.
 *
 * @returns A success response if the media is uploaded.
 *
 * @throws
 * - An ApiError if organizer does not exist.
 * - An ApiError if upload operation fails.
 */
const uploadOrganizerMedia = async (
  id: string,
  data: UploadOrganizerMediaValidatorSchema,
) => {
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
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Upload Media Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default uploadOrganizerMedia;
