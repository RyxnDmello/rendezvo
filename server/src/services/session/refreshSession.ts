import { Context } from "hono";

import { Role } from "@constants/user";

import UserModel from "@models/user.model";
import OrganizerModel from "@models/organizer.model";

import {
  createAccessToken as createUserAccessToken,
  verifyRefreshToken as verifyUserRefreshToken,
} from "@services/user/helpers/token";

import {
  createAccessToken as createOrganizerAccessToken,
  verifyRefreshToken as verifyOrganizerRefreshToken,
} from "@services/organizer/helpers/token";

import { getSessionCookie as getUserSessionCookie } from "@services/user/helpers/cookie";
import { getSessionCookie as getOrganizerSessionCookie } from "@services/organizer/helpers/cookie";

import validateSession from "./validators/validateSession";

import ApiError from "@utils/ApiError";

/**
 * A service function that refreshes an authenticated session.
 *
 * This function determines the role and refreshes the session accordingly. It validates
 * the refresh token, verifies the session, and generates a new access token. It retrieves
 * the associated account details and returns them with the new token.
 *
 * @param {Context} ctx - The hono context.
 * @param {Role} role - The role of the requester.
 *
 * @returns The account data along with a new access token.
 *
 * @throws
 * - An ApiError if role is invalid.
 * - An ApiError if refresh token is missing.
 * - An ApiError if refresh token is invalid or expired.
 * - An ApiError if account does not exist.
 */
const refreshSession = async (ctx: Context, role: Role) => {
  switch (role) {
    case "user":
      return await refreshUserSession(ctx);

    case "organizer":
      return await refreshOrganizerSession(ctx);

    default:
      throw new ApiError("Invalid Authorization Provided", "BAD_REQUEST");
  }
};

const refreshUserSession = async (ctx: Context) => {
  const token = await getUserSessionCookie(ctx);

  if (!token) {
    throw new ApiError(
      "Authorization Token Has Not Been Provided",
      "REFRESH_TOKEN_MISSING",
    );
  }

  const payload = await verifyUserRefreshToken(token);
  await validateSession(token, payload);

  const accessToken = await createUserAccessToken(payload.data.id);

  const dbUser = await UserModel.findById(payload.data.id, {
    name: 1,
    email: 1,
    mobile: 1,
    password: 1,
    verified: 1,
  }).lean({
    versionKey: false,
  });

  if (!dbUser) {
    throw new ApiError(
      "User With Given Email Address Does Not Exist",
      "BAD_REQUEST",
    );
  }

  return {
    id: dbUser._id,
    name: dbUser.name,
    email: dbUser.email,
    mobile: dbUser.mobile,
    verified: dbUser.verified,
    accessToken,
  };
};

const refreshOrganizerSession = async (ctx: Context) => {
  const token = await getOrganizerSessionCookie(ctx);

  if (!token) {
    throw new ApiError(
      "Authorization Token Has Not Been Provided",
      "REFRESH_TOKEN_MISSING",
    );
  }

  const payload = await verifyOrganizerRefreshToken(token);
  await validateSession(token, payload);

  const accessToken = await createOrganizerAccessToken(payload.data.id);

  const dbOrganizer = await OrganizerModel.findById(payload.data.id, {
    name: 1,
    email: 1,
    mobile: 1,
    password: 1,
    verified: 1,
  }).lean({
    versionKey: false,
  });

  if (!dbOrganizer) {
    throw new ApiError(
      "User With Given Email Address Does Not Exist",
      "BAD_REQUEST",
    );
  }

  return {
    id: dbOrganizer._id,
    name: dbOrganizer.name,
    email: dbOrganizer.email,
    mobile: dbOrganizer.mobile,
    verified: dbOrganizer.verified,
    accessToken,
  };
};

export default refreshSession;
