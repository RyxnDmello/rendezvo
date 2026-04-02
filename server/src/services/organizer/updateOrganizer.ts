import OrganizerModel from "@models/organizer.model";

import { clearCachedOrganizer } from "./helpers/redis";

import { UpdateOrganizerValidatorSchema } from "@validators/organizer/updateOrganizer.validator";

import ApiError from "@utils/ApiError";

/**
 * A service function that updates an organizer.
 *
 * This function validates the organizer's existence and verification status.
 * It checks for mobile number conflicts if the mobile field is being updated.
 * It updates the organizer data in the database. It clears the cached
 * organizer data after a successful update.
 *
 * @param {string} id - The ID of the organizer.
 * @param {UpdateOrganizerValidatorSchema} data - The validated update organizer payload.
 *
 * @returns A success response if the organizer is updated.
 *
 * @throws
 * - An ApiError if update operation fails.
 * - An ApiError if organizer does not exist.
 * - An ApiError if organizer is not verified.
 * - An ApiError if mobile number already exists.
 */
const updateOrganizer = async (
  id: string,
  data: UpdateOrganizerValidatorSchema,
) => {
  const dbOrganizer = await OrganizerModel.findOne(
    {
      _id: id,
    },
    {
      mobile: 1,
      verified: 1,
    },
  ).lean({
    versionKey: false,
  });

  if (!dbOrganizer) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (!dbOrganizer.verified) {
    throw new ApiError(
      "Unable To Proceed Since Account Has Not Been Verified",
      "ACCOUNT_LOCKED",
    );
  }

  if (data.mobile && data.mobile !== dbOrganizer.mobile) {
    const dbOrganizerWithMobile = await OrganizerModel.exists({
      mobile: data.mobile,
    });

    if (dbOrganizerWithMobile) {
      throw new ApiError(
        "User With Given Mobile Number Already Exists",
        "BAD_REQUEST",
      );
    }
  }

  const { acknowledged, modifiedCount } = await OrganizerModel.updateOne(
    {
      _id: dbOrganizer._id,
    },
    data,
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Update User Due To Server",
      "INTERNAL_SERVER_ERROR",
    );
  }

  await clearCachedOrganizer(dbOrganizer._id.toString());

  return {
    success: true,
  };
};

export default updateOrganizer;
