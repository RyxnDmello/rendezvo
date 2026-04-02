import { Context, Next } from "hono";

import { Role } from "@constants/user";

import { AccessTokenPayload as UserAccessTokenPayload } from "@services/user/helpers/token";
import { AccessTokenPayload as OrganizerAccessTokenPayload } from "@services/organizer/helpers/token";

import { verifyAccessToken as verifyUserAccessToken } from "@services/user/helpers/token";
import { verifyAccessToken as verifyOrganizerAccessToken } from "@services/organizer/helpers/token";

import ApiError from "@utils/ApiError";

type Payload = UserAccessTokenPayload | OrganizerAccessTokenPayload | null;

/**
 * A helper function used to authorize users based on their role.
 *
 * @param {Role} role - The role of the user to authorize.
 *
 * @returns The next controller context.
 *
 * @throws
 * - An ApiError if the role does not match.
 * - An ApiError if the authorization bearer token is not set in the headers.
 *
 * @example
 * const authorizeUser = protect("user");
 * const authorizeAdmin = protect("admin");
 * const authorizeOrganizer = protect("organizer");
 */
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

/**
 * A middleware to authorize users with the role of "user".
 *
 * This middleware authorizes users that have a role of "user". It
 * checks the authorization header for the bearer token. If the
 * bearer token exists and is valid, the user is authorized.
 *
 * @example
 * const app = new Hono();
 *
 * app.get("/", authorizeUser, handler)
 * app.put("/", authorizeUser, handler)
 * app.post("/", authorizeUser, handler)
 * app.patch("/", authorizeUser, handler)
 * app.delete("/", authorizeUser, handler)
 */
export const authorizeUser = protect("user");

/**
 * A middleware to authorize users with the role of "admin".
 *
 * This middleware authorizes users that have a role of "admin". It
 * checks the authorization header for the bearer token. If the
 * bearer token exists and is valid, the user is authorized.
 *
 * @example
 * const app = new Hono();
 *
 * app.get("/", authorizeAdmin, handler)
 * app.put("/", authorizeAdmin, handler)
 * app.post("/", authorizeAdmin, handler)
 * app.patch("/", authorizeAdmin, handler)
 * app.delete("/", authorizeAdmin, handler)
 */
export const authorizeAdmin = protect("admin");

/**
 * A middleware to authorize users with the role of "organizer".
 *
 * This middleware authorizes users that have a role of "organizer".
 * It checks the authorization header for the bearer token. If the
 * bearer token exists and is valid, the user is authorized.
 *
 * @example
 * const app = new Hono();
 *
 * app.get("/", authorizeOrganizer, handler)
 * app.put("/", authorizeOrganizer, handler)
 * app.post("/", authorizeOrganizer, handler)
 * app.patch("/", authorizeOrganizer, handler)
 * app.delete("/", authorizeOrganizer, handler)
 */
export const authorizeOrganizer = protect("organizer");

export default protect;
