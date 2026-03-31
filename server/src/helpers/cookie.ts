import { Context } from "hono";
import { CookieOptions } from "hono/utils/cookie";
import { setSignedCookie, getSignedCookie, deleteCookie } from "hono/cookie";

import { env } from "@constants/env";

import ApiError from "@utils/ApiError";

const { COOKIES_SECRET } = env.SECRET;

const COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "Strict",
  maxAge: 60 * 60 * 24 * 7,
  secure: process.env.NODE_ENV === "production",
};

export const setCookie = async (
  ctx: Context,
  name: string,
  value: string,
  expiry: number = 60 * 24 * 7,
) => {
  await setSignedCookie(ctx, name, value, COOKIES_SECRET, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * expiry,
  });
};

export const getCookie = async (ctx: Context, name: string) => {
  const data = await getSignedCookie(ctx, COOKIES_SECRET, name);

  if (data === undefined || !data) {
    throw new ApiError("Cookie Has Not Been Set", "BAD_REQUEST");
  }

  return data;
};

export const removeCookie = async (ctx: Context, name: string) => {
  deleteCookie(ctx, name, {
    path: "/",
  });
};
