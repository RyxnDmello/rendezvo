import OrganizerModel from "@models/organizer.model";

import { LoginOrganizerValidatorSchema } from "@validators/organizer/loginOrganizer.validator";

import { verifyPassword } from "@helpers/encryption";

import { createTokens } from "./helpers/token";

import ApiError from "@utils/ApiError";

/**
 * A service function that logs in an organizer.
 *
 * This function validates organizer credentials, checks verification status,
 * and generates authentication tokens if applicable.
 *
 * @param {string} ip - The IP address of the organizer.
 * @param {LoginUserValidatorSchema} data - The validated login organizer payload.
 *
 * @returns A response containing organizer details and tokens if login is successful.
 *
 * @throws
 * - An ApiError if password is not set.
 * - An ApiError if password is invalid.
 * - An ApiError if organizer does not exist.
 */
const loginOrganizer = async (
  ip: string,
  data: LoginOrganizerValidatorSchema,
) => {
  const dbOrganizer = await OrganizerModel.findOne(
    {
      email: data.email,
    },
    {
      name: 1,
      email: 1,
      mobile: 1,
      password: 1,
      verified: 1,
    },
  ).lean({
    versionKey: false,
  });

  if (!dbOrganizer) {
    throw new ApiError(
      "User With Given Email Address Does Not Exist",
      "BAD_REQUEST",
    );
  }

  if (!dbOrganizer.password) {
    throw new ApiError("Please Try A Different Method To Login", "BAD_REQUEST");
  }

  const valid = await verifyPassword(data.password, dbOrganizer.password);

  if (!valid) {
    throw new ApiError("Invalid Password", "INVALID_CREDENTIALS");
  }

  if (!dbOrganizer.verified) {
    return {
      id: dbOrganizer._id,
      verified: dbOrganizer.verified,
    };
  }

  const { accessToken, refreshToken } = await createTokens(
    ip,
    dbOrganizer._id.toString(),
  );

  return {
    id: dbOrganizer._id,
    name: dbOrganizer.name,
    email: dbOrganizer.email,
    mobile: dbOrganizer.mobile,
    verified: dbOrganizer.verified,
    accessToken,
    refreshToken,
  };
};

export default loginOrganizer;
