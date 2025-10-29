import { Context } from "hono";

import { env } from "@helpers/env";
import { setCookie, getCookie, removeCookie } from "@helpers/cookie";

const { ORGANIZER_REFRESH_TOKEN_EXPIRY } = env.SECRET;

const NAME = "refreshToken";

export const setRefreshTokenCookie = async (ctx: Context, token: string) => {
  await setCookie(ctx, NAME, token, ORGANIZER_REFRESH_TOKEN_EXPIRY);
};

export const getRefreshTokenCookie = async (ctx: Context) => {
  return await getCookie(ctx, NAME);
};

export const removeRefreshTokenCookie = async (ctx: Context) => {
  return await removeCookie(ctx, NAME);
};
