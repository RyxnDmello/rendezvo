import UserModel from "@models/user.model";

import { LoginUserValidatorSchema } from "@validators/user/loginUser.validator";

import { verifyPassword } from "@helpers/encryption";

import { createTokens } from "./helpers/token";

import ApiError from "@utils/ApiError";

/**
 * A service function that logs in a user.
 *
 * This function validates user credentials, checks verification status,
 * and generates authentication tokens if applicable.
 *
 * @param {string} ip - The IP address of the user.
 * @param {LoginUserValidatorSchema} data - The validated login user payload.
 *
 * @returns A response containing user details and tokens if login is successful.
 *
 * @throws
 * - An ApiError if user does not exist.
 * - An ApiError if password is not set.
 * - An ApiError if password is invalid.
 */
const loginUser = async (ip: string, data: LoginUserValidatorSchema) => {
  const dbUser = await UserModel.findOne(
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

  if (!dbUser) {
    throw new ApiError(
      "User With Given Email Address Does Not Exist",
      "BAD_REQUEST",
    );
  }

  if (!dbUser.password) {
    throw new ApiError("Please Try A Different Method To Login", "BAD_REQUEST");
  }

  const valid = await verifyPassword(data.password, dbUser.password);

  if (!valid) {
    throw new ApiError("Invalid Password", "INVALID_CREDENTIALS");
  }

  if (!dbUser.verified) {
    return {
      id: dbUser._id,
      verified: dbUser.verified,
    };
  }

  const { accessToken, refreshToken } = await createTokens(
    ip,
    dbUser._id.toString(),
  );

  return {
    id: dbUser._id,
    name: dbUser.name,
    email: dbUser.email,
    mobile: dbUser.mobile,
    verified: dbUser.verified,
    accessToken,
    refreshToken,
  };
};

export default loginUser;
