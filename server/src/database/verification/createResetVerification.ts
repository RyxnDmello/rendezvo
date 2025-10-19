import OrganizerModel from "@models/organizer.model";
import VerificationModel from "@models/verification.model";

import { CreateResetVerificationValidatorSchema } from "@validators/verification/createResetVerification.validator";

import { getExpiryDate } from "@helpers/date";
import { generateOTP } from "@helpers/generator";
import { hashPassword, verifyPassword } from "@helpers/password";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const createResetVerification = async (
  data: CreateResetVerificationValidatorSchema
) => {
  try {
    const [dbOrganizer, dbVerification] = await Promise.all([
      OrganizerModel.findOne(
        {
          email: data.email,
        },
        {
          verified: 1,
          password: 1,
        }
      ).lean({
        versionKey: false,
      }),
      VerificationModel.exists({
        type: "reset",
        email: data.email,
      }),
    ]);

    if (!dbOrganizer) {
      throw new ApiError(
        "User With Given Email Address Does Not Exist",
        "BAD_REQUEST"
      );
    }

    if (!dbOrganizer.verified) {
      throw new ApiError(
        "Unable To Proceed Since User Has Not Been Verified",
        "BAD_REQUEST"
      );
    }

    if (!dbOrganizer.password) {
      throw new ApiError(
        "You Have Opted For A Different Authentication Method",
        "BAD_REQUEST"
      );
    }

    const valid = await verifyPassword(data.password, dbOrganizer.password);

    if (!valid) {
      throw new ApiError("Invalid Password", "INVALID_CREDENTIALS");
    }

    const encrypted = await hashPassword(data.newPassword);

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
            password: encrypted,
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
      email: data.email,
      password: encrypted,
      expiredAt: expiry,
    });

    await newVerification.save();

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
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

export default createResetVerification;
