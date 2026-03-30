import OrganizerModel from "@models/organizer.model";

import { LoginOrganizerValidatorSchema } from "@validators/organizer/loginOrganizer.validator";

import { verifyPassword } from "@helpers/encryption";

import { createTokens } from "./helpers/token";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const loginOrganizer = async (
  ip: string,
  data: LoginOrganizerValidatorSchema,
) => {
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
      },
    ).lean({
      versionKey: false,
    });

    if (!dbOrganizer) {
      throw new ApiError(
        "User With Given Email Address Does Not Exist",
        "BAD_REQUEST",
      );
    }

    if (!dbOrganizer.password) {
      throw new ApiError(
        "Please Try A Different Method To Login",
        "BAD_REQUEST",
      );
    }

    const valid = await verifyPassword(data.password, dbOrganizer.password);

    if (!valid) {
      throw new ApiError("Invalid Password", "INVALID_CREDENTIALS");
    }

    if (!dbOrganizer.verified) {
      return {
        id: dbOrganizer._id,
        verified: dbOrganizer.verified,
      };
    }

    const { accessToken, refreshToken } = await createTokens(
      ip,
      dbOrganizer._id.toString(),
    );

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
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Login Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default loginOrganizer;
