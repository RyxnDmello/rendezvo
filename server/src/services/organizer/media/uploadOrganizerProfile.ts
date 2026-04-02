import OrganizerModel from "@models/organizer.model";

import { UploadOrganizerProfileValidatorSchema } from "@validators/organizer/media/uploadOrganizerProfile.validator";

import { uploadProfile, updateProfile } from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that uploads an organizer's profile image.
 *
 * This function checks if the organizer exists. It uploads or updates the
 * profile image in storage and updates the database with the new image reference.
 *
 * @param {string} id - The ID of the organizer.
 * @param {UploadOrganizerProfileValidatorSchema} data - The validated upload profile payload.
 *
 * @returns A success response if the profile image is uploaded.
 *
 * @throws
 * - An ApiError if organizer does not exist.
 * - An ApiError if upload operation fails.
 */
const uploadOrganizerProfile = async (
  id: string,
  data: UploadOrganizerProfileValidatorSchema,
) => {
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
};

export default uploadOrganizerProfile;
