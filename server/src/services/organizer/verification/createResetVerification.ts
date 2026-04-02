import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { getDate } from "@helpers/date";
import { generateOTP } from "@helpers/generator";

import ApiError from "@utils/ApiError";

/**
 * A service function that creates an organizer password reset verification.
 *
 * This function checks if the organizer exists. It generates a new OTP
 * and expiry time. It updates the existing verification if present or
 * creates a new one.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns A success response if the verification is created.
 *
 * @throws An ApiError if organizer does not exist.
 */
const createResetVerification = async (id: string) => {
  const [dbOrganizer, dbVerification] = await Promise.all([
    OrganizerModel.exists({
      _id: id,
    }),
    VerificationModel.exists({
      user: id,
      type: "reset",
    }),
  ]);

  if (!dbOrganizer) {
    throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
  }

  const otp = generateOTP();

  const expiry = getDate(15);

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
    type: "reset",
    otp,
    expiredAt: expiry,
  });

  await newVerification.save();

  return {
    success: true,
  };
};

export default createResetVerification;
