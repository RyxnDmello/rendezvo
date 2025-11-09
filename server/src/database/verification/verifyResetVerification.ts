import { startSession } from "mongoose";

import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { VerifyResetVerificationValidatorSchema } from "@validators/verification/verifyResetVerification.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const verifyResetVerification = async (
  data: VerifyResetVerificationValidatorSchema
) => {
  try {
    const dbVerification = await VerificationModel.findOne(
      {
        type: "reset",
        email: data.email,
      },
      {
        otp: 1,
        password: 1,
        expiredAt: 1,
      }
    ).lean({
      versionKey: false,
    });

    if (!dbVerification || !dbVerification.password) {
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

      const result = await OrganizerModel.updateOne(
        {
          email: data.email,
        },
        {
          $set: {
            password: dbVerification.password,
          },
        }
      );

      if (!result.acknowledged || result.modifiedCount !== 1) {
        throw new ApiError(
          "Unable To Verify User Due To Server Error",
          "INTERNAL_SERVER_ERROR"
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

export default verifyResetVerification;
