import OrganizerModel from "@models/organizer.model";

import { UploadOrganizerBannerValidatorSchema } from "@validators/organizer/media/uploadOrganizerBanner.validator";

import { uploadBanner, updateBanner } from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that uploads an organizer's banner image.
 *
 * This function checks if the organizer exists. It uploads or updates the
 * banner in storage and updates the database with the new banner reference.
 *
 * @param {string} id - The ID of the organizer.
 * @param {UploadOrganizerBannerValidatorSchema} data - The validated upload banner payload.
 *
 * @returns A success response if the banner is uploaded.
 *
 * @throws
 * - An ApiError if organizer does not exist.
 * - An ApiError if upload operation fails.
 */
const uploadOrganizerBanner = async (
  id: string,
  data: UploadOrganizerBannerValidatorSchema,
) => {
  const dbOrganizer = await OrganizerModel.findById(id, {
    profile: 1,
  }).lean({
    versionKey: false,
  });

  if (!dbOrganizer) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  const bannerID = dbOrganizer.profile?.banner
    ? await updateBanner(id, data.banner)
    : await uploadBanner(id, data.banner);

  const { acknowledged, modifiedCount } = await OrganizerModel.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        profile: {
          ...dbOrganizer.profile,
          banner: {
            id: bannerID,
            type: "image",
          },
        },
      },
    },
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Upload Banner Image Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default uploadOrganizerBanner;
