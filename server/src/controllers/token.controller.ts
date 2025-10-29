import { Context } from "hono";

import refreshAccessToken from "@database/token/refreshAccessToken";

import { getRefreshTokenCookie } from "@database/organizer/helpers/cookie";

import ApiError, { ApiErrorResponse } from "@utils/ApiError";

export const _refreshAccessToken = async (ctx: Context) => {
  try {
    const user = ctx.req.header("user");

    if (!user) {
      throw new ApiError(
        "You Are Not Authorized To Access This Service",
        "BAD_REQUEST"
      );
    }

    const token = await getRefreshTokenCookie(ctx);

    const credentials = await refreshAccessToken(user, token);
    return ctx.json(credentials, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
