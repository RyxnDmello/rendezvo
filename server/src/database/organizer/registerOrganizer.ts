import OrganizerModel from "@models/organizer.model";

import { RegisterOrganizerValidatorSchema } from "@validators/organizer/registerOrganizer.validator";

import { hashPassword } from "@helpers/password";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const registerOrganizer = async (data: RegisterOrganizerValidatorSchema) => {
  try {
    const [dbOrganizerWithEmail, dbOrganizerWithMobile] = await Promise.all([
      await OrganizerModel.exists({
        email: data.email,
      }),
      await OrganizerModel.exists({
        mobile: data.mobile,
      }),
    ]);

    if (dbOrganizerWithEmail) {
      throw new ApiError(
        "User With Given Email Address Already Exists",
        "BAD_REQUEST",
      );
    }

    if (dbOrganizerWithMobile) {
      throw new ApiError(
        "User With Given Mobile Number Already Exists",
        "BAD_REQUEST",
      );
    }

    const encrypted = await hashPassword(data.password);

    const newOrganizer = new OrganizerModel({
      ...data,
      password: encrypted,
    });

    await newOrganizer.save();

    return {
      id: newOrganizer.id,
      verified: newOrganizer.verified,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Create Account Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default registerOrganizer;
