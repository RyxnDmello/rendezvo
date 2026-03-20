import { Context, Next } from "hono";

import ApiError, { ApiErrorResponse } from "@utils/ApiError";

import { verifyAccessToken as verifyUserAccessToken } from "@database/user/helpers/token";
import { verifyAccessToken as verifyOrganizerAccessToken } from "@database/organizer/helpers/token";

import { Role } from "@constants/user";

const protect = (role: Role) => {
  return async (ctx: Context, next: Next) => {
    try {
      const { authorization } = ctx.req.header();

      if (!authorization) {
        throw new ApiError(
          "You Are Not Authorized To Access This Service",
          "INVALID_CREDENTIALS",
        );
      }

      const token = authorization.split(" ")[1];

      if (!token) {
        throw new ApiError(
          "You Are Not Authorized To Access This Service",
          "ACCESS_TOKEN_MISSING",
        );
      }

      let payload = null;

      switch (role) {
        case "user":
          payload = await verifyUserAccessToken(token);
          break;

        case "organizer":
          payload = await verifyOrganizerAccessToken(token);
          break;

        default:
          throw new ApiError(
            "You Do Not Have Sufficient Permissions To Access This Service",
            "UNAUTHORIZED",
          );
      }

      ctx.set("user", payload);

      return next();
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};

export const authorizeUser = protect("user");
export const authorizeAdmin = protect("admin");
export const authorizeOrganizer = protect("organizer");

export default protect;
