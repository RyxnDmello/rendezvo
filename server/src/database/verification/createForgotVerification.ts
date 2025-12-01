import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { getExpiryDate } from "@helpers/date";
import { generateOTP } from "@helpers/generator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const createForgotVerification = async (email: string) => {
  try {
    const [dbOrganizer, dbVerification] = await Promise.all([
      OrganizerModel.exists({ email }),
      VerificationModel.exists({
        type: "reset",
        email,
      }),
    ]);

    if (!dbOrganizer) {
      throw new ApiError(
        "User With Given Email Address Does Not Exist",
        "BAD_REQUEST"
      );
    }

    const otp = generateOTP();

    const expiry = getExpiryDate(15);

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
        }
      );

      return {
        success: true,
      };
    }

    const newVerification = new VerificationModel({
      type: "reset",
      otp,
      email,
      expiredAt: expiry,
    });

    await newVerification.save();

    return {
      success: true,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Send Verification Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default createForgotVerification;
