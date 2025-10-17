import { password } from "bun";

import OrganizerModel from "@models/organizer.model";

import { LoginSchema } from "@validators/organizer/login.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";

import ApiError from "@utils/ApiError";

const loginOrganizer = async (data: LoginSchema) => {
  try {
    const dbOrganizer = await OrganizerModel.findOne(
      {
        email: data.email,
      },
      {
        name: 1,
        email: 1,
        mobile: 1,
        password: 1,
        verified: 1,
      }
    ).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new ApiError(
        "User With Given Email Address Does Not Exist",
        "BAD_REQUEST"
      );
    }

    if (!dbOrganizer.password) {
      throw new ApiError(
        "Please Try A Different Method To Login",
        "INVALID_CREDENTIALS"
      );
    }

    const verified = await password.verify(
      data.password,
      dbOrganizer.password,
      "bcrypt"
    );

    if (!verified) {
      throw new ApiError("Invalid Password", "INVALID_CREDENTIALS");
    }

    return {
      id: dbOrganizer._id,
      name: dbOrganizer.name,
      email: dbOrganizer.email,
      mobile: dbOrganizer.mobile,
      verified: dbOrganizer.verified,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Login Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default loginOrganizer;
