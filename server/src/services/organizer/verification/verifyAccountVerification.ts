import { startSession } from "mongoose";

import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { VerifyAccountVerificationValidatorSchema } from "@validators/verification/verifyAccountVerification.validator";

import { createTokens } from "@services/organizer/helpers/token";

import ApiError from "@utils/ApiError";

/**
 * A service function that verifies an organizer account verification.
 *
 * This function validates the verification record and OTP. It deletes the
 * verification entry and updates the organizer as verified within a transaction.
 * It generates authentication tokens after successful verification.
 *
 * @param {string} ip - The IP address of the organizer.
 * @param {string} id - The ID of the organizer.
 * @param {VerifyAccountVerificationValidatorSchema} data - The validated verification payload.
 *
 * @returns A response containing organizer details and tokens after successful verification.
 *
 * @throws
 * - An ApiError if verification does not exist.
 * - An ApiError if verification has expired.
 * - An ApiError if OTP is invalid.
 * - An ApiError if verification update fails.
 */
const verifyAccountVerification = async (
  ip: string,
  id: string,
  data: VerifyAccountVerificationValidatorSchema,
) => {
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

    const dbOrganizer = await OrganizerModel.findByIdAndUpdate(
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

    if (!dbOrganizer) {
      throw new ApiError(
        "Unable To Verify User Due To Server Error",
        "INTERNAL_SERVER_ERROR",
      );
    }

    const { accessToken, refreshToken } = await createTokens(
      ip,
      dbOrganizer._id.toString(),
    );

    await session.commitTransaction();

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
};

export default verifyAccountVerification;
