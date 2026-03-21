import refreshAccessToken from "@database/token/refreshAccessToken";

import { RefreshAccessTokenContext } from "@validators/token/refreshAccessToken.validator";

import { getSessionCookie as getUserSessionCookie } from "@database/user/helpers/cookie";
import { getSessionCookie as getOrganizerSessionCookie } from "@database/organizer/helpers/cookie";

import { ApiErrorResponse, ApiErrorCustomResponse } from "@utils/ApiError";

export const _refreshAccessToken = async (ctx: RefreshAccessTokenContext) => {
  const { role } = ctx.req.valid("query");

  try {
    let token = null;

    switch (role) {
      case "user":
        token = await getUserSessionCookie(ctx);
        break;

      case "organizer":
        token = await getOrganizerSessionCookie(ctx);
        break;

      default:
        return ApiErrorCustomResponse(ctx, {
          error: "Invalid User Role Provided",
          code: "BAD_REQUEST",
        });
    }

    const credentials = await refreshAccessToken(role, token);
    return ctx.json(credentials, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
