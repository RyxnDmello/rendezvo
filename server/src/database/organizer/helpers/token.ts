import {
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";

import { createToken, verifyToken } from "@helpers/token";

import ApiError from "@utils/ApiError";

import { env } from "@constants/env";

export interface AccessTokenPayload {
  id: string;
  role: "user";
}

export interface RefreshTokenPayload {
  id: string;
}

const {
  ORGANIZER_ACCESS_TOKEN_EXPIRY,
  ORGANIZER_REFRESH_TOKEN_EXPIRY,
  ORGANIZER_ACCESS_TOKEN_SECRET,
  ORGANIZER_REFRESH_TOKEN_SECRET,
} = env.SECRET;

export const createAccessToken = async (id: string) => {
  return await createToken(
    {
      id,
      role: "organizer",
    },
    ORGANIZER_ACCESS_TOKEN_SECRET,
    ORGANIZER_ACCESS_TOKEN_EXPIRY,
  );
};

export const createRefreshToken = async (id: string) => {
  return await createToken(
    { id },
    ORGANIZER_REFRESH_TOKEN_SECRET,
    ORGANIZER_REFRESH_TOKEN_EXPIRY,
  );
};

export const createTokens = async (id: string) => {
  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(id),
    createRefreshToken(id),
  ]);

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyAccessToken = async (token: string) => {
  try {
    const payload = await verifyToken<AccessTokenPayload>(
      token,
      ORGANIZER_ACCESS_TOKEN_SECRET,
    );

    if (!payload) {
      throw new ApiError(
        "Invalid Authorization Provided",
        "ACCESS_TOKEN_INVALID",
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
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

export const verifyRefreshToken = async (token: string) => {
  try {
    const payload = await verifyToken<RefreshTokenPayload>(
      token,
      ORGANIZER_REFRESH_TOKEN_SECRET,
    );

    if (!payload) {
      throw new ApiError(
        "Invalid Authorization Provided",
        "REFRESH_TOKEN_INVALID",
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
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
