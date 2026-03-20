import { startSession } from "mongoose";

import UserModel from "@models/user.model";
import VerificationModel from "@models/verification.model";

import { VerifyAccountVerificationValidatorSchema } from "@validators/verification/verifyAccountVerification.validator";

import { createTokens } from "@database/organizer/helpers/token";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const verifyAccountVerification = async (
  id: string,
  data: VerifyAccountVerificationValidatorSchema,
) => {
  try {
    const dbVerification = await VerificationModel.findOne(
      {
        user: id,
        type: "auth",
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

    const session = await startSession();

    try {
      session.startTransaction();

      await VerificationModel.deleteOne(
        {
          _id: dbVerification._id,
        },
        { session },
      );

      const dbUser = await UserModel.findByIdAndUpdate(
        id,
        {
          $set: {
            verified: true,
          },
        },
        {
          session,
          new: true,
          projection: {
            name: 1,
            email: 1,
            mobile: 1,
            verified: 1,
          },
        },
      ).lean({
        versionKey: true,
      });

      if (!dbUser) {
        throw new ApiError(
          "Unable To Verify User Due To Server Error",
          "INTERNAL_SERVER_ERROR",
        );
      }

      await session.commitTransaction();

      const { accessToken, refreshToken } = await createTokens(
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
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Verify User Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default verifyAccountVerification;
