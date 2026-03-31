import { Context } from "hono";

import { Role } from "@constants/user";

import revokeSession from "@services/session/revokeSession";
import revokeSessions from "@services/session/revokeSessions";
import refreshSession from "@services/session/refreshSession";

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

export const _refreshSession = (role: Role) => {
  return async (ctx: Context) => {
    const user = await refreshSession(ctx, role);
    return ctx.json(user, 200);
  };
};
