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

/**
 * A helper function to create a signed cookie with default configurations.
 *
 * @param {Context} ctx - A hono context.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to be assigned to the cookie.
 * @param {number} expiry - The expiry of the cookie. Must be set in minutes.
 *
 * @example
 * await setCookie(ctx, "session", "user", 10);
 */
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

/**
 * A helper function to return the value of a signed cookie.
 *
 * @param {Context} ctx - A hono context.
 * @param {string} name - The name of the cookie.
 *
 * @returns The value of the cookie.
 *
 * @throws An ApiError if the value is undefined or null.
 *
 * @example
 * const cookie = await getCookie(ctx, "session");
 */
export const getCookie = async (ctx: Context, name: string) => {
  const data = await getSignedCookie(ctx, COOKIES_SECRET, name);

  if (data === undefined || !data) {
    throw new ApiError("Cookie Has Not Been Set", "BAD_REQUEST");
  }

  return data;
};

/**
 * A helper function to remove a cookie.
 *
 * @param {Context} ctx - A hono context.
 * @param {string} name - The name of the cookie.
 *
 * @example
 * await removeCookie(ctx, "session");
 */
export const removeCookie = async (ctx: Context, name: string) => {
  deleteCookie(ctx, name, {
    path: "/",
  });
};
