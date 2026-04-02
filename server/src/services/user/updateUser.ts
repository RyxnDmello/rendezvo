import UserModel from "@models/user.model";

import { clearCachedUser } from "./helpers/redis";

import { UpdateUserValidatorSchema } from "@validators/user/updateUser.validator";

import ApiError from "@utils/ApiError";

/**
 * A service function that updates a user.
 *
 * This function validates the users's existence and verification status. It
 * checks for mobile number conflicts if the mobile field is being updated.
 * It updates the user data in the database. It clears the cached user data
 * after a successful update.
 *
 * @param {string} id - The ID of the user.
 * @param {UpdateUserValidatorSchema} data - The validated update user payload.
 *
 * @returns A success response if the user is updated.
 *
 * @throws
 * - An ApiError if user does not exist.
 * - An ApiError if user is not verified.
 * - An ApiError if update operation fails.
 * - An ApiError if mobile number already exists.
 */
const updateUser = async (id: string, data: UpdateUserValidatorSchema) => {
  const dbUser = await UserModel.findOne(
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

  if (!dbUser) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (!dbUser.verified) {
    throw new ApiError(
      "Unable To Proceed Since Account Has Not Been Verified",
      "ACCOUNT_LOCKED",
    );
  }

  if (data.mobile && data.mobile !== dbUser.mobile) {
    const dbUserWithMobile = await UserModel.exists({
      mobile: data.mobile,
    });

    if (dbUserWithMobile) {
      throw new ApiError(
        "User With Given Mobile Number Already Exists",
        "BAD_REQUEST",
      );
    }
  }

  const { acknowledged, modifiedCount } = await UserModel.updateOne(
    {
      _id: dbUser._id,
    },
    data,
  );

  if (!acknowledged || modifiedCount !== 1) {
    throw new ApiError(
      "Unable To Update User Due To Server",
      "INTERNAL_SERVER_ERROR",
    );
  }

  await clearCachedUser(dbUser._id.toString());

  return {
    success: true,
  };
};

export default updateUser;
