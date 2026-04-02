import OrganizerModel from "@models/organizer.model";

import { RegisterOrganizerValidatorSchema } from "@validators/organizer/registerOrganizer.validator";

import { hashPassword } from "@helpers/encryption";

import ApiError from "@utils/ApiError";

/**
 * A service function that registers a new organizer.
 *
 * This function checks for existing organizers with the same email or mobile,
 * encrypts the password, creates a new organizer, and saves it to the database.
 *
 * @param {RegisterOrganizerValidatorSchema} data - The validated register organizer payload.
 *
 * @returns A response containing the organizer ID and verification status.
 *
 * @throws
 * - An ApiError if organizer with the given email already exists.
 * - An ApiError if organizer with the given mobile number already exists.
 */
const registerOrganizer = async (data: RegisterOrganizerValidatorSchema) => {
  const [dbOrganizerWithEmail, dbOrganizerWithMobile] = await Promise.all([
    await OrganizerModel.exists({
      email: data.email,
    }),
    await OrganizerModel.exists({
      mobile: data.mobile,
    }),
  ]);

  if (dbOrganizerWithEmail) {
    throw new ApiError(
      "User With Given Email Address Already Exists",
      "BAD_REQUEST",
    );
  }

  if (dbOrganizerWithMobile) {
    throw new ApiError(
      "User With Given Mobile Number Already Exists",
      "BAD_REQUEST",
    );
  }

  const encrypted = await hashPassword(data.password);

  const newOrganizer = new OrganizerModel({
    ...data,
    password: encrypted,
  });

  await newOrganizer.save();

  return {
    id: newOrganizer.id,
    verified: newOrganizer.verified,
  };
};

export default registerOrganizer;
