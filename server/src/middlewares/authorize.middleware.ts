import { Context, Next } from "hono";

import ApiError, { ApiErrorResponse } from "@utils/ApiError";

import { verifyAccessToken } from "@database/organizer/helpers/token";

type Role = "admin" | "organizer" | "attendee";

const authorize = (role?: Role) => {
  return async (ctx: Context, next: Next) => {
    try {
      const { authorization } = ctx.req.header();

      if (!authorization) {
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

      const payload = await verifyAccessToken(token);

      if (role && role !== payload.role) {
        throw new ApiError(
          "You Do Not Have Sufficient Permissions To Access This Service",
          "UNAUTHORIZED"
        );
      }

      ctx.set("user", payload);

      return next();
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};

export const authorizeUser = authorize();
export const authorizeAdmin = authorize("admin");
export const authorizeAttendee = authorize("attendee");
export const authorizeOrganizer = authorize("organizer");

export default authorize;
