import UserModel from "@models/user.model";

import { RegisterUserValidatorSchema } from "@validators/user/registerUser.validator";

import { hashPassword } from "@helpers/encryption";

import ApiError from "@utils/ApiError";

/**
 * A service function that registers a new user.
 *
 * This function checks for existing users with the same email or mobile,
 * encrypts the password, creates a new user, and saves it to the database.
 *
 * @param {RegisterOrganizerValidatorSchema} data - The validated register user payload.
 *
 * @returns A response containing the user ID and verification status.
 *
 * @throws
 * - An ApiError if user with the given email already exists.
 * - An ApiError if user with the given mobile number already exists.
 */
const registerUser = async (data: RegisterUserValidatorSchema) => {
  const [dbUserWithEmail, dbUserWithMobile] = await Promise.all([
    await UserModel.exists({
      email: data.email,
    }),
    await UserModel.exists({
      mobile: data.mobile,
    }),
  ]);

  if (dbUserWithEmail) {
    throw new ApiError(
      "User With Given Email Address Already Exists",
      "BAD_REQUEST",
    );
  }

  if (dbUserWithMobile) {
    throw new ApiError(
      "User With Given Mobile Number Already Exists",
      "BAD_REQUEST",
    );
  }

  const encrypted = await hashPassword(data.password);

  const newUser = new UserModel({
    ...data,
    password: encrypted,
  });

  await newUser.save();

  return {
    id: newUser.id,
    verified: newUser.verified,
  };
};

export default registerUser;
