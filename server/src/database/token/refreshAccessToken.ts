import OrganizerModel from "@models/organizer.model";

import {
  createAccessToken,
  verifyRefreshToken,
} from "@database/organizer/helpers/token";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const refreshAccessToken = async (user: string, token: string) => {
  try {
    const { id } = await verifyRefreshToken(token);

    if (user === "organizer") {
      const dbOrganizer = await OrganizerModel.findOne(
        {
          _id: id,
        },
        {
          name: 1,
          email: 1,
          mobile: 1,
          verified: 1,
        }
      ).lean({
        versionKey: false,
      });

      if (!dbOrganizer || !dbOrganizer.verified) {
        throw new ApiError(
          "You Are Not Authorized To Access This Service",
          "BAD_REQUEST"
        );
      }

      const accessToken = await createAccessToken(
        dbOrganizer._id.toString(),
        dbOrganizer.email
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
      "BAD_REQUEST"
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
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export default refreshAccessToken;
