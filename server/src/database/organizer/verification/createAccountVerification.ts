import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { getExpiryDate } from "@helpers/date";
import { generateOTP } from "@helpers/generator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const createAccountVerification = async (id: string) => {
  try {
    const [dbOrganizer, dbVerification] = await Promise.all([
      OrganizerModel.findById(id, {
        verified: 1,
      }).lean({
        versionKey: false,
      }),
      VerificationModel.exists({
        user: id,
        type: "auth",
      }),
    ]);

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (dbOrganizer.verified) {
      throw new ApiError("User Has Already Been Verified", "BAD_REQUEST");
    }

    const otp = generateOTP();

    const expiry = getExpiryDate(10);

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
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Send Verification Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default createAccountVerification;
