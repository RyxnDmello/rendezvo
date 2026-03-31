import { startSession } from "mongoose";

import UserModel from "@models/user.model";
import VerificationModel from "@models/verification.model";

import { VerifyResetVerificationValidatorSchema } from "@validators/verification/verifyResetVerification.validator";

import { hashPassword, verifyPassword } from "@helpers/encryption";

import ApiError from "@utils/ApiError";

const verifyResetVerification = async (
  id: string,
  data: VerifyResetVerificationValidatorSchema,
) => {
  const [dbUser, dbVerification] = await Promise.all([
    UserModel.findById(id, {
      verified: 1,
      password: 1,
    }).lean({
      versionKey: false,
    }),
    VerificationModel.findOne(
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
    }),
  ]);

  if (!dbUser) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (!dbUser.verified || !dbUser.password) {
    throw new ApiError(
      "You Are Not Authorized To Access This Service",
      "BAD_REQUEST",
    );
  }

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

  const valid = await verifyPassword(data.password, dbUser.password);

  if (!valid) {
    throw new ApiError("Invalid Password Provided", "INVALID_CREDENTIALS");
  }

  const encrypted = await hashPassword(data.newPassword);

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

export default verifyResetVerification;
