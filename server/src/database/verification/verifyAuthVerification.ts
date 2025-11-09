import { startSession } from "mongoose";

import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { VerifyAuthVerificationValidatorSchema } from "@validators/verification/verifyAuthVerification.validator";

import { createTokens } from "@database/organizer/helpers/token";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const verifyAuthVerification = async (
  data: VerifyAuthVerificationValidatorSchema
) => {
  try {
    const dbVerification = await VerificationModel.findOne(
      {
        type: "auth",
        email: data.email,
      },
      {
        otp: 1,
        expiredAt: 1,
      }
    ).lean({
      versionKey: false,
    });

    if (!dbVerification) {
      throw new ApiError(
        "Verification For Given Email Address Does Not Exist",
        "BAD_REQUEST"
      );
    }

    if (dbVerification.expiredAt < new Date()) {
      throw new ApiError(
        "Verification For Given Email Address Has Expired",
        "SESSION_EXPIRED"
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
        { session }
      );

      const dbOrganizer = await OrganizerModel.findOneAndUpdate(
        {
          email: data.email,
        },
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
        }
      ).lean({
        versionKey: true,
      });

      if (!dbOrganizer) {
        throw new ApiError(
          "Unable To Verify User Due To Server Error",
          "INTERNAL_SERVER_ERROR"
        );
      }

      await session.commitTransaction();

      const { accessToken, refreshToken } = await createTokens(
        dbOrganizer._id.toString(),
        dbOrganizer.email
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
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Verify User Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default verifyAuthVerification;
