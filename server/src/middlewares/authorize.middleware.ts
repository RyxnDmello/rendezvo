import { Context, Next } from "hono";

import ApiError, { ApiErrorResponse } from "@utils/ApiError";

import { verifyAccessToken } from "@database/organizer/helpers/token";

const authorize = async (ctx: Context, next: Next) => {
  try {
    const { user, authorization } = ctx.req.header();

    if (!user || !authorization || !["organizer", "attendee"].includes(user)) {
      throw new ApiError(
        "You Are Not Authorized To Access This Service",
        "INVALID_CREDENTIALS"
      );
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new ApiError(
        "You Are Not Authorized To Access This Service",
        "ACCESS_TOKEN_MISSING"
      );
    }

    if (user === "organizer") {
      await verifyAccessToken(token);
    }

    return next();
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export default authorize;
