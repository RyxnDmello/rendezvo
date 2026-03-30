import { startSession } from "mongoose";

import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { VerifyResetVerificationValidatorSchema } from "@validators/verification/verifyResetVerification.validator";

import { hashPassword, verifyPassword } from "@helpers/encryption";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const verifyResetVerification = async (
  id: string,
  data: VerifyResetVerificationValidatorSchema,
) => {
  try {
    const [dbOrganizer, dbVerification] = await Promise.all([
      OrganizerModel.findById(id, {
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

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbOrganizer.verified || !dbOrganizer.password) {
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

    const valid = await verifyPassword(data.password, dbOrganizer.password);

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

      const result = await OrganizerModel.updateOne(
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

export default verifyResetVerification;
