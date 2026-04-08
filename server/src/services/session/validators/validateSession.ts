import SessionModel from "@models/session.model";

import { RefreshTokenPayload as UserRefreshTokenPayload } from "@services/user/helpers/token";
import { RefreshTokenPayload as OrganizerRefreshTokenPayload } from "@services/organizer/helpers/token";

import { hashToken } from "@helpers/encryption";

import ApiError from "@utils/ApiError";

/**
 * A service function that validates an authenticated session.
 *
 * This function verifies that the session exists in the database using the
 * refresh token payload. It ensures the session matches the stored token by
 * comparing the hashed value. If the session is invalid or does not exist,
 * it invalidates all sessions for the account.
 *
 * @param {string} token - The raw refresh token.
 * @param {OrganizerRefreshTokenPayload | UserRefreshTokenPayload} payload - The decoded refresh token payload.
 *
 * @throws
 * - An ApiError if session does not exist.
 * - An ApiError if token does not match the stored session.
 */
const validateSession = async (
  token: string,
  payload: OrganizerRefreshTokenPayload | UserRefreshTokenPayload,
) => {
  const { data, jti, iss } = payload;

  const { id, ip, di, role } = data;

  const dbSession = await SessionModel.findOne(
    {
      user: id,
      ip,
      di,
      jti,
      iss,
      role,
    },
    {
      token: 1,
    },
  ).lean({
    versionKey: false,
  });

  if (!dbSession) {
    await SessionModel.deleteMany({
      user: id,
    });

    throw new ApiError(
      "Your Authorization Has Been Invalidated",
      "REFRESH_TOKEN_INVALID",
    );
  }

  const hashed = await hashToken(token);

  if (hashed !== dbSession.token) {
    throw new ApiError(
      "Your Authorization Has Been Invalidated",
      "REFRESH_TOKEN_INVALID",
    );
  }
};

export default validateSession;
