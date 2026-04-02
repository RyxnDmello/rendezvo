import { Context } from "hono";

import { env } from "@constants/env";

import { setCookie, getCookie, removeCookie } from "@helpers/cookie";

const { USER_REFRESH_TOKEN_EXPIRY } = env.SECRET;

const NAME = "session";

/**
 * A service helper function that sets the user's session cookie.
 *
 * This function stores the refresh token in a secure cookie with the configured expiry time.
 *
 * @param {Context} ctx - A hono context.
 * @param {string} token - The refresh token to be stored.
 *
 * @returns A promise that resolves when the cookie is set.
 */
export const setSessionCookie = async (ctx: Context, token: string) => {
  await setCookie(ctx, NAME, token, USER_REFRESH_TOKEN_EXPIRY);
};

/**
 * A service helper function that retrieves the user's session cookie.
 *
 * This function fetches the refresh token stored in the cookie.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns The user's session cookie value if present.
 */
export const getSessionCookie = async (ctx: Context) => {
  return await getCookie(ctx, NAME);
};

/**
 * A service helper function that deletes the user's session cookie.
 *
 * This function removes the refresh token cookie from the client.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A promise that resolves when the cookie is removed.
 */
export const deleteSessionCookie = async (ctx: Context) => {
  return await removeCookie(ctx, NAME);
};
