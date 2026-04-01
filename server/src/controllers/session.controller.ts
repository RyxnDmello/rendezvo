import { Context } from "hono";

import { Role } from "@constants/user";

import revokeSession from "@services/session/revokeSession";
import revokeSessions from "@services/session/revokeSessions";
import refreshSession from "@services/session/refreshSession";

/**
 * A controller function that revokes the session for the authenticated user.
 *
 * If the "all" query is provided with a value of "true", then all the sessions
 * of that user will be revoked.
 *
 * @param {Role} role - The role of the user.
 *
 * @returns A success response if the session is revoked.
 */
export const _revokeSession = (role: Role) => {
  return async (ctx: Context) => {
    const all = ctx.req.query("all");

    if (all === "true") {
      const result = await revokeSessions(ctx, role);
      return ctx.json(result, 200);
    }

    const result = await revokeSession(ctx, role);
    return ctx.json(result, 200);
  };
};

/**
 * A controller function that refreshes the session for the authenticated user.
 *
 * @param {Role} role - The role of the user.
 *
 * @returns A response of the refreshed session user.
 */
export const _refreshSession = (role: Role) => {
  return async (ctx: Context) => {
    const user = await refreshSession(ctx, role);
    return ctx.json(user, 200);
  };
};
