import { Context, Next } from "hono";

import { Role } from "@constants/user";

import { AccessTokenPayload as UserAccessTokenPayload } from "@services/user/helpers/token";
import { AccessTokenPayload as OrganizerAccessTokenPayload } from "@services/organizer/helpers/token";

import { verifyAccessToken as verifyUserAccessToken } from "@services/user/helpers/token";
import { verifyAccessToken as verifyOrganizerAccessToken } from "@services/organizer/helpers/token";

import ApiError from "@utils/ApiError";

type Payload = UserAccessTokenPayload | OrganizerAccessTokenPayload | null;

const protect = (role: Role) => {
  return async (ctx: Context, next: Next) => {
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

    let payload: Payload = null;

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

    ctx.set("user", payload.data);

    return next();
  };
};

export const authorizeUser = protect("user");
export const authorizeAdmin = protect("admin");
export const authorizeOrganizer = protect("organizer");

export default protect;
