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

export interface AccessTokenPayload extends Payload {
  data: {
    id: string;
    role: "organizer";
  };
}

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
