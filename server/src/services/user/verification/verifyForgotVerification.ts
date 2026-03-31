import { startSession } from "mongoose";

import UserModel from "@models/user.model";
import VerificationModel from "@models/verification.model";

import { VerifyForgotVerificationValidatorSchema } from "@validators/verification/verifyForgotVerification.validator";

import { hashPassword } from "@helpers/encryption";

import ApiError from "@utils/ApiError";

const verifyForgotVerification = async (
  id: string,
  data: VerifyForgotVerificationValidatorSchema,
) => {
  const dbVerification = await VerificationModel.findOne(
    {
      user: id,
      type: "reset",
    },
    {
      otp: 1,
      expiredAt: 1,
    },
  ).lean({
    versionKey: false,
  });

  if (!dbVerification) {
    throw new ApiError(
      "Verification For Given User Does Not Exist",
      "BAD_REQUEST",
    );
  }

  if (dbVerification.expiredAt < new Date()) {
    throw new ApiError(
      "Verification For Given User Has Expired",
      "SESSION_EXPIRED",
    );
  }

  if (dbVerification.otp !== data.otp) {
    throw new ApiError("Invalid OTP Provided", "INVALID_CREDENTIALS");
  }

  const encrypted = await hashPassword(data.password);

  const session = await startSession();

  try {
    session.startTransaction();

    await VerificationModel.deleteOne(
      {
        _id: dbVerification._id,
      },
      { session },
    );

    const result = await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encrypted,
        },
      },
    );

    if (!result.acknowledged || result.modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Verify User Due To Server Error",
        "INTERNAL_SERVER_ERROR",
      );
    }

    await session.commitTransaction();

    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default verifyForgotVerification;
