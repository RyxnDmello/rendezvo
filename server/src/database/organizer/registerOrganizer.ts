import { password } from "bun";

import OrganizerModel from "@models/organizer.model";

import { RegisterSchema } from "@validators/organizer/register.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const registerOrganizer = async (data: RegisterSchema) => {
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
        "BAD_REQUEST"
      );
    }

    if (dbOrganizerWithMobile) {
      throw new ApiError(
        "User With Given Mobile Number Already Exists",
        "BAD_REQUEST"
      );
    }

    const encrypted = await password.hash(data.password!, {
      algorithm: "bcrypt",
      cost: 12,
    });

    const newOrganizer = new OrganizerModel({
      ...data,
      password: encrypted,
    });

    await newOrganizer.save();

    return {
      id: newOrganizer.id,
      name: newOrganizer.name,
      email: newOrganizer.email,
      mobile: newOrganizer.mobile,
      verified: newOrganizer.verified,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Create Account Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default registerOrganizer;
