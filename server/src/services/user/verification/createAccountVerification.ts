import UserModel from "@models/user.model";
import VerificationModel from "@models/verification.model";

import { getDate } from "@helpers/date";
import { generateOTP } from "@helpers/generator";

import ApiError from "@utils/ApiError";

/**
 * A service function that creates a user account verification.
 *
 * This function checks if the user exists and is not already
 * verified. It generates a new OTP and expiry time. It updates the
 * existing verification if present or creates a new one.
 *
 * @param {string} id - The ID of the user.
 *
 * @returns A success response if the verification is created.
 *
 * @throws
 * - An ApiError if user does not exist.
 * - An ApiError if user is already verified.
 */
const createAccountVerification = async (id: string) => {
  const [dbUser, dbVerification] = await Promise.all([
    UserModel.findById(id, {
      verified: 1,
    }).lean({
      versionKey: false,
    }),
    VerificationModel.exists({
      user: id,
      type: "auth",
    }),
  ]);

  if (!dbUser) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (dbUser.verified) {
    throw new ApiError("User Has Already Been Verified", "BAD_REQUEST");
  }

  const otp = generateOTP();

  const expiry = getDate(10);

  if (dbVerification) {
    await VerificationModel.updateOne(
      {
        _id: dbVerification._id,
      },
      {
        $set: {
          otp,
          expiredAt: expiry,
        },
      },
      {
        runValidators: true,
      },
    );

    return {
      success: true,
    };
  }

  const newVerification = new VerificationModel({
    user: id,
    type: "auth",
    otp,
    expiredAt: expiry,
  });

  await newVerification.save();

  return {
    success: true,
  };
};

export default createAccountVerification;
