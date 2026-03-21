import UserModel from "@models/user.model";
import OrganizerModel from "@models/organizer.model";

import {
  createAccessToken as createUserAccessToken,
  verifyRefreshToken as verifyUserRefreshToken,
} from "@database/user/helpers/token";

import {
  createAccessToken as createOrganizerAccessToken,
  verifyRefreshToken as verifyOrganizerRefreshToken,
} from "@database/organizer/helpers/token";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

import { Role } from "@constants/user";

const refreshAccessToken = async (role: Role, token: string) => {
  try {
    if (role === "user") {
      const { id } = await verifyUserRefreshToken(token);

      const dbUser = await UserModel.findOne(
        {
          _id: id,
        },
        {
          name: 1,
          email: 1,
          mobile: 1,
          verified: 1,
        },
      ).lean({
        versionKey: false,
      });

      if (!dbUser || !dbUser.verified) {
        throw new ApiError(
          "You Are Not Authorized To Access This Service",
          "FORBIDDEN",
        );
      }

      const accessToken = await createUserAccessToken(dbUser._id.toString());

      return {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        mobile: dbUser.mobile,
        verified: dbUser.verified,
        accessToken,
      };
    }

    if (role === "organizer") {
      const { id } = await verifyOrganizerRefreshToken(token);

      const dbOrganizer = await OrganizerModel.findOne(
        {
          _id: id,
        },
        {
          name: 1,
          email: 1,
          mobile: 1,
          verified: 1,
        },
      ).lean({
        versionKey: false,
      });

      if (!dbOrganizer || !dbOrganizer.verified) {
        throw new ApiError(
          "You Are Not Authorized To Access This Service",
          "FORBIDDEN",
        );
      }

      const accessToken = await createOrganizerAccessToken(
        dbOrganizer._id.toString(),
      );

      return {
        id: dbOrganizer._id,
        name: dbOrganizer.name,
        email: dbOrganizer.email,
        mobile: dbOrganizer.mobile,
        verified: dbOrganizer.verified,
        accessToken,
      };
    }

    throw new ApiError(
      "You Are Not Authorized To Access This Service",
      "FORBIDDEN",
    );
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Authorize User Due To Server Error",
      "INTERNAL_SERVER_ERROR",
    );
  }
};

export default refreshAccessToken;
