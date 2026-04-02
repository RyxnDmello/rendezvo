import { Context } from "hono";

import { Role } from "@constants/user";

import SessionModel from "@models/session.model";

import { verifyRefreshToken as verifyUserRefreshToken } from "@services/user/helpers/token";
import { verifyRefreshToken as verifyOrganizerRefreshToken } from "@services/organizer/helpers/token";

import {
  getSessionCookie as getUserSessionCookie,
  deleteSessionCookie as deleteUserSessionCookie,
} from "@services/user/helpers/cookie";

import {
  getSessionCookie as getOrganizerSessionCookie,
  deleteSessionCookie as deleteOrganizerSessionCookie,
} from "@services/organizer/helpers/cookie";

import validateSession from "./helpers/validateSession";

import ApiError from "@utils/ApiError";

/**
 * A service function that revokes an authenticated session.
 *
 * This function determines the role and revokes the session accordingly. It validates
 * the refresh token, verifies the session, and deletes the session record. It also
 * removes the session cookie from the client.
 *
 * @param {Context} ctx - The hono context.
 * @param {Role} role - The role of the requester.
 *
 * @returns A success response if the session is revoked.
 *
 * @throws
 * - An ApiError if role is invalid.
 * - An ApiError if refresh token is missing.
 * - An ApiError if refresh token is invalid or expired.
 * - An ApiError if session deletion fails.
 */
const revokeSession = async (ctx: Context, role: Role) => {
  switch (role) {
    case "user":
      return await revokeUserSession(ctx);

    case "organizer":
      return await revokeOrganizerSession(ctx);

    default:
      throw new ApiError("Invalid Authorization Provided", "BAD_REQUEST");
  }
};

const revokeUserSession = async (ctx: Context) => {
  const token = await getUserSessionCookie(ctx);

  if (!token) {
    throw new ApiError(
      "Authorization Token Has Not Been Provided",
      "REFRESH_TOKEN_MISSING",
    );
  }

  const payload = await verifyUserRefreshToken(token);
  await validateSession(token, payload);

  const { data, jti, iss } = payload;

  const { id, ip, di, role } = data;

  const [{ acknowledged, deletedCount }] = await Promise.all([
    SessionModel.deleteOne({
      user: id,
      ip,
      di,
      jti,
      iss,
      role,
    }),
    deleteUserSessionCookie(ctx),
  ]);

  if (!acknowledged || deletedCount !== 1) {
    await deleteUserSessionCookie(ctx);

    throw new ApiError(
      "Your Authorization Has Been Invalidated",
      "REFRESH_TOKEN_INVALID",
    );
  }

  return {
    success: true,
  };
};

const revokeOrganizerSession = async (ctx: Context) => {
  const token = await getOrganizerSessionCookie(ctx);

  if (!token) {
    throw new ApiError(
      "Authorization Token Has Not Been Provided",
      "REFRESH_TOKEN_MISSING",
    );
  }

  const payload = await verifyOrganizerRefreshToken(token);
  await validateSession(token, payload);

  const { data, jti, iss } = payload;

  const { id, ip, di, role } = data;

  const [{ acknowledged, deletedCount }] = await Promise.all([
    SessionModel.deleteOne({
      user: id,
      ip,
      di,
      jti,
      iss,
      role,
    }),
    deleteOrganizerSessionCookie(ctx),
  ]);

  if (!acknowledged || deletedCount !== 1) {
    await deleteOrganizerSessionCookie(ctx);

    throw new ApiError(
      "Your Authorization Has Been Invalidated",
      "REFRESH_TOKEN_INVALID",
    );
  }

  return {
    success: true,
  };
};

export default revokeSession;
