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

import validateSession from "./validators/validateSession";

import ApiError from "@utils/ApiError";

/**
 * A service function that revokes all authenticated sessions.
 *
 * This function determines the role and revokes all sessions accordingly. It validates
 * the refresh token, verifies the session, and deletes all sessions associated with the
 * account. It also removes the session cookie from the client.
 *
 * @param {Context} ctx - The hono context.
 * @param {Role} role - The role of the requester.
 *
 * @returns A success response if all sessions are revoked.
 *
 * @throws
 * - An ApiError if role is invalid.
 * - An ApiError if refresh token is missing.
 * - An ApiError if refresh token is invalid or expired.
 * - An ApiError if session deletion fails.
 */
const revokeSessions = async (ctx: Context, role: Role) => {
  switch (role) {
    case "user":
      return await revokeUserSessions(ctx);

    case "organizer":
      return await revokeOrganizerSessions(ctx);

    default:
      throw new ApiError("Invalid Authorization Provided", "BAD_REQUEST");
  }
};

const revokeUserSessions = async (ctx: Context) => {
  const token = await getUserSessionCookie(ctx);

  if (!token) {
    throw new ApiError(
      "Authorization Token Has Not Been Provided",
      "REFRESH_TOKEN_MISSING",
    );
  }

  const payload = await verifyUserRefreshToken(token);
  await validateSession(token, payload);

  const { data, iss } = payload;

  const { id, role } = data;

  const [{ acknowledged, deletedCount }] = await Promise.all([
    SessionModel.deleteMany({
      user: id,
      iss,
      role,
    }),
    deleteUserSessionCookie(ctx),
  ]);

  if (!acknowledged || deletedCount < 1) {
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

const revokeOrganizerSessions = async (ctx: Context) => {
  const token = await getOrganizerSessionCookie(ctx);

  if (!token) {
    throw new ApiError(
      "Authorization Token Has Not Been Provided",
      "REFRESH_TOKEN_MISSING",
    );
  }

  const payload = await verifyOrganizerRefreshToken(token);
  await validateSession(token, payload);

  const { data, iss } = payload;

  const { id, role } = data;

  const [{ acknowledged, deletedCount }] = await Promise.all([
    SessionModel.deleteMany({
      user: id,
      iss,
      role,
    }),
    deleteOrganizerSessionCookie(ctx),
  ]);

  if (!acknowledged || deletedCount < 1) {
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

export default revokeSessions;
