import OrganizerModel from "@models/organizer.model";

import { deleteBanner } from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that deletes an organizer's banner image.
 *
 * This function checks if the organizer exists. It removes the banner
 * reference from the database and deletes the stored banner file if present.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns A success response if the banner is deleted.
 *
 * @throws
 * - An ApiError if organizer does not exist.
 * - An ApiError if delete operation fails.
 */
const deleteOrganizerBanner = async (id: string) => {
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
};

export default deleteOrganizerBanner;
