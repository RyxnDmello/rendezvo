import refreshAccessToken from "@database/token/refreshAccessToken";

import { RefreshAccessTokenContext } from "@validators/token/refreshAccessToken.validator";

import { getSessionCookie } from "@database/organizer/helpers/cookie";

import { ApiErrorResponse } from "@utils/ApiError";

export const _refreshAccessToken = async (ctx: RefreshAccessTokenContext) => {
  const { role } = ctx.req.valid("query");

  try {
    const token = await getSessionCookie(ctx);
    const credentials = await refreshAccessToken(role, token);
    return ctx.json(credentials, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
