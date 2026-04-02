import {
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";

import { env } from "@constants/env";

import SessionModel from "@models/session.model";

import { getDate } from "@helpers/date";
import { hashToken } from "@helpers/encryption";
import { generateDeviceID } from "@helpers/generator";
import { createToken, verifyToken, Payload } from "@helpers/token";

import ApiError, { isApiError } from "@utils/ApiError";

/**
 * An interface that represents the payload of an organizer's access token.
 *
 * This interface extends the global Payload type, which must be respected.
 * The data of the access token includes the ID and role of "organizer".
 */
export interface AccessTokenPayload extends Payload {
  data: {
    id: string;
    role: "organizer";
  };
}

/**
 * An interface that represents the payload of an organizer's refresh token.
 *
 * This interface extends the global Payload type, which must be respected.
 * The data of the refresh token includes the ID, IP address, device ID,
 * and role of "organizer".
 */
export interface RefreshTokenPayload extends Payload {
  data: {
    id: string;
    ip: string;
    di: string;
    role: "organizer";
  };
}

const {
  ORGANIZER_ACCESS_TOKEN_ISSUER,
  ORGANIZER_ACCESS_TOKEN_SECRET,
  ORGANIZER_ACCESS_TOKEN_EXPIRY,
  ORGANIZER_REFRESH_TOKEN_ISSUER,
  ORGANIZER_REFRESH_TOKEN_SECRET,
  ORGANIZER_REFRESH_TOKEN_EXPIRY,
} = env.SECRET;

/**
 * A service helper function that creates an organizer's access token.
 *
 * This function generates a signed JWT containing the
 * organizer ID and role using configured secrets and expiry.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The generated access token.
 */
export const createAccessToken = async (id: string) => {
  const data: AccessTokenPayload["data"] = {
    id,
    role: "organizer",
  };

  const { token } = await createToken(
    data,
    ORGANIZER_ACCESS_TOKEN_SECRET,
    ORGANIZER_ACCESS_TOKEN_ISSUER,
    ORGANIZER_ACCESS_TOKEN_EXPIRY,
  );

  return token;
};

/**
 * A service helper function that creates an organizer's refresh token.
 *
 * This function generates a device ID, creates a signed JWT,
 * hashes the token, stores a session in the database, and
 * returns the raw token.
 *
 * @param {string} ip - The IP address of the organizer.
 * @param {string} id - The ID of the organizer.
 *
 * @returns The generated refresh token.
 */
export const createRefreshToken = async (ip: string, id: string) => {
  const di = generateDeviceID();

  const data: RefreshTokenPayload["data"] = {
    di,
    id,
    ip,
    role: "organizer",
  };

  const { jti, token } = await createToken(
    data,
    ORGANIZER_REFRESH_TOKEN_SECRET,
    ORGANIZER_REFRESH_TOKEN_ISSUER,
    ORGANIZER_REFRESH_TOKEN_EXPIRY,
  );

  const hashed = await hashToken(token);

  const expiredAt = getDate(ORGANIZER_REFRESH_TOKEN_EXPIRY);

  const newSession = new SessionModel({
    user: id,
    ip,
    di,
    jti,
    iss: ORGANIZER_REFRESH_TOKEN_ISSUER,
    role: "organizer",
    token: hashed,
    expiredAt,
  });

  await newSession.save();

  return token;
};

/**
 * A service helper function that creates an organizer's access and refresh tokens.
 *
 * This function generates both tokens in parallel and returns them together.
 *
 * @param {string} ip - The IP address of the organizer.
 * @param {string} id - The ID of the organizer.
 *
 * @returns An object containing the accessToken and refreshToken.
 */
export const createTokens = async (ip: string, id: string) => {
  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(id),
    createRefreshToken(ip, id),
  ]);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * A service helper function that verifies an organizer's access token.
 *
 * This function validates the token signature, issuer, and
 * expiry, and maps known JWT errors to standardized API errors.
 *
 * @param {string} token - The access token to verify.
 *
 * @returns The decoded access token payload.
 *
 * @throws
 * - An ApiError if token is invalid.
 * - An ApiError if token is expired.
 * - An ApiError if token is revoked or mismatched.
 */
export const verifyAccessToken = async (token: string) => {
  try {
    const payload = await verifyToken<AccessTokenPayload>(
      token,
      ORGANIZER_ACCESS_TOKEN_SECRET,
      ORGANIZER_ACCESS_TOKEN_ISSUER,
    );

    if (!payload) {
      throw new ApiError(
        "Invalid Authorization Provided",
        "ACCESS_TOKEN_INVALID",
      );
    }

    return payload;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (error instanceof JwtTokenExpired) {
      throw new ApiError(
        "Your Authorization Has Expired",
        "ACCESS_TOKEN_EXPIRED",
      );
    }

    if (error instanceof JwtTokenSignatureMismatched) {
      throw new ApiError(
        "Your Authorization Does Not Match",
        "ACCESS_TOKEN_REVOKED",
      );
    }

    if (error instanceof JwtTokenInvalid) {
      throw new ApiError(
        "Invalid Authorization Provided",
        "ACCESS_TOKEN_INVALID",
      );
    }

    throw new ApiError(
      "Invalid Or Expired Authorization",
      "ACCESS_TOKEN_INVALID",
    );
  }
};

/**
 * A service helper function that verifies an organizer's refresh token.
 *
 * This function validates the token signature, issuer, and
 * expiry, and maps known JWT errors to standardized API errors.
 *
 * @param {string} token - The refresh token to verify.
 *
 * @returns The decoded refresh token payload.
 *
 * @throws
 * - An ApiError if token is invalid.
 * - An ApiError if token is expired.
 * - An ApiError if token is revoked or mismatched.
 */
export const verifyRefreshToken = async (token: string) => {
  try {
    const payload = await verifyToken<RefreshTokenPayload>(
      token,
      ORGANIZER_REFRESH_TOKEN_SECRET,
      ORGANIZER_REFRESH_TOKEN_ISSUER,
    );

    if (!payload) {
      throw new ApiError(
        "Invalid Authorization Provided",
        "REFRESH_TOKEN_INVALID",
      );
    }

    return payload;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (error instanceof JwtTokenExpired) {
      throw new ApiError(
        "Your Authorization Has Expired",
        "REFRESH_TOKEN_EXPIRED",
      );
    }

    if (error instanceof JwtTokenSignatureMismatched) {
      throw new ApiError(
        "Your Authorization Does Not Match",
        "REFRESH_TOKEN_REVOKED",
      );
    }

    if (error instanceof JwtTokenInvalid) {
      throw new ApiError(
        "Invalid Authorization Provided",
        "REFRESH_TOKEN_INVALID",
      );
    }

    throw new ApiError(
      "Invalid Or Expired Authorization",
      "REFRESH_TOKEN_INVALID",
    );
  }
};
