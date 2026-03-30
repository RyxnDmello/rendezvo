import { Context } from "hono";

import revokeSession from "@database/session/revokeSession";
import refreshSession from "@database/session/refreshSession";

import { ApiErrorResponse } from "@utils/ApiError";

import { Role } from "@constants/user";

export const _revokeSession = (role: Role) => {
  return async (ctx: Context) => {
    try {
      const result = await revokeSession(ctx, role);
      return ctx.json(result, 200);
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};

export const _refreshSession = (role: Role) => {
  return async (ctx: Context) => {
    try {
      const user = await refreshSession(ctx, role);
      return ctx.json(user, 200);
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};
