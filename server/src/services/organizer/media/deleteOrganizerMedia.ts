import OrganizerModel from "@models/organizer.model";

import { deleteProfile, deleteBanner } from "../helpers/storage";

import ApiError from "@utils/ApiError";

/**
 * A service function that deletes an organizer's profile and banner image.
 *
 * This function checks if the organizer exists. It removes both profile
 * image and banner from the database and deletes the stored files if present.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns A success response if the media is deleted.
 *
 * @throws
 * - An ApiError if organizer does not exist.
 * - An ApiError if delete operation fails.
 */
const deleteOrganizerMedia = async (id: string) => {
  const dbOrganizer = await OrganizerModel.findById(id, {
    profile: 1,
  }).lean({
    versionKey: false,
  });

  if (!dbOrganizer) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (!dbOrganizer.profile?.image && !dbOrganizer.profile?.banner) {
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
            banner: null,
          },
        },
      },
      {
        runValidators: true,
      },
    ),
    Promise.all([
      dbOrganizer.profile?.image ? deleteProfile(id) : undefined,
      dbOrganizer.profile?.banner ? deleteBanner(id) : undefined,
    ]),
  ]);

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Delete Media Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }

  return {
    success: true,
  };
};

export default deleteOrganizerMedia;
