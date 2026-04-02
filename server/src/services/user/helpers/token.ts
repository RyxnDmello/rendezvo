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
 * An interface that represents the payload of an user's access token.
 *
 * This interface extends the global Payload type, which must be respected.
 * The data of the access token includes the ID and role of "user".
 */
export interface AccessTokenPayload extends Payload {
  data: {
    id: string;
    role: "user";
  };
}

/**
 * An interface that represents the payload of an user's refresh token.
 *
 * This interface extends the global Payload type, which must be respected.
 * The data of the refresh token includes the ID, IP address, device ID,
 * and role of "user".
 */
export interface RefreshTokenPayload extends Payload {
  data: {
    id: string;
    ip: string;
    di: string;
    role: "user";
  };
}

const {
  USER_ACCESS_TOKEN_ISSUER,
  USER_ACCESS_TOKEN_SECRET,
  USER_ACCESS_TOKEN_EXPIRY,
  USER_REFRESH_TOKEN_ISSUER,
  USER_REFRESH_TOKEN_SECRET,
  USER_REFRESH_TOKEN_EXPIRY,
} = env.SECRET;

/**
 * A service helper function that creates a user's access token.
 *
 * This function generates a signed JWT containing the
 * user ID and role using configured secrets and expiry.
 *
 * @param {string} id - The ID of the user.
 *
 * @returns The generated access token.
 */
export const createAccessToken = async (id: string) => {
  const data: AccessTokenPayload["data"] = {
    id,
    role: "user",
  };

  const { token } = await createToken(
    data,
    USER_ACCESS_TOKEN_SECRET,
    USER_ACCESS_TOKEN_ISSUER,
    USER_ACCESS_TOKEN_EXPIRY,
  );

  return token;
};

/**
 * A service helper function that creates a user's refresh token.
 *
 * This function generates a device ID, creates a signed JWT,
 * hashes the token, stores a session in the database, and
 * returns the raw token.
 *
 * @param {string} ip - The IP address of the user.
 * @param {string} id - The ID of the user.
 *
 * @returns The generated refresh token.
 */
export const createRefreshToken = async (ip: string, id: string) => {
  const di = generateDeviceID();

  const data: RefreshTokenPayload["data"] = {
    di,
    id,
    ip,
    role: "user",
  };

  const { jti, token } = await createToken(
    data,
    USER_REFRESH_TOKEN_SECRET,
    USER_REFRESH_TOKEN_ISSUER,
    USER_REFRESH_TOKEN_EXPIRY,
  );

  const hashed = await hashToken(token);

  const expiredAt = getDate(USER_REFRESH_TOKEN_EXPIRY);

  const newSession = new SessionModel({
    user: id,
    ip,
    di,
    jti,
    iss: USER_REFRESH_TOKEN_ISSUER,
    role: "user",
    token: hashed,
    expiredAt,
  });

  await newSession.save();

  return token;
};

/**
 * A service helper function that creates a user's access and refresh tokens.
 *
 * This function generates both tokens in parallel and returns them together.
 *
 * @param {string} ip - The IP address of the user.
 * @param {string} id - The ID of the user.
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
 * A service helper function that verifies a user's access token.
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
      USER_ACCESS_TOKEN_SECRET,
      USER_ACCESS_TOKEN_ISSUER,
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
 * A service helper function that verifies a user's refresh token.
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
      USER_REFRESH_TOKEN_SECRET,
      USER_REFRESH_TOKEN_ISSUER,
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
