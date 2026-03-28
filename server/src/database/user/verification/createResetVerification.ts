import UserModel from "@models/user.model";
import VerificationModel from "@models/verification.model";

import { CreateResetVerificationValidatorSchema } from "@validators/verification/createResetVerification.validator";

import { getDate } from "@helpers/date";
import { generateOTP } from "@helpers/generator";
import { hashPassword, verifyPassword } from "@helpers/encryption";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const createResetVerification = async (
  id: string,
  data: CreateResetVerificationValidatorSchema,
) => {
  try {
    const [dbUser, dbVerification] = await Promise.all([
      UserModel.findById(id, {
        verified: 1,
        password: 1,
      }).lean({
        versionKey: false,
      }),
      VerificationModel.exists({
        user: id,
        type: "reset",
      }),
    ]);

    if (!dbUser) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbUser.verified) {
      throw new ApiError(
        "Unable To Proceed Since User Has Not Been Verified",
        "BAD_REQUEST",
      );
    }

    if (!dbUser.password) {
      throw new ApiError(
        "You Have Opted For A Different Authentication Method",
        "BAD_REQUEST",
      );
    }

    const valid = await verifyPassword(data.password, dbUser.password);

    if (!valid) {
      throw new ApiError("Invalid Password", "INVALID_CREDENTIALS");
    }

    const encrypted = await hashPassword(data.newPassword);

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
            password: encrypted,
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
      password: encrypted,
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

export default createResetVerification;
