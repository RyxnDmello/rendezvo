import { Context } from "hono";

import { setCookie, getCookie, removeCookie } from "@helpers/cookie";

import { env } from "@constants/env";

const { USER_REFRESH_TOKEN_EXPIRY } = env.SECRET;

const NAME = "session";

export const setSessionCookie = async (ctx: Context, token: string) => {
  await setCookie(ctx, NAME, token, USER_REFRESH_TOKEN_EXPIRY);
};

export const getSessionCookie = async (ctx: Context) => {
  return await getCookie(ctx, NAME);
};

export const deleteSessionCookie = async (ctx: Context) => {
  return await removeCookie(ctx, NAME);
};
