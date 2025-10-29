import { Context } from "hono";

import fetchOrganizer from "@database/organizer/fetchOrganizer";

import loginOrganizer from "@database/organizer/loginOrganizer";
import registerOrganizer from "@database/organizer/registerOrganizer";

import updateOrganizer from "@database/organizer/updateOrganizer";

import { LoginOrganizerContext } from "@validators/organizer/loginOrganizer.validator";
import { UpdateOrganizerContext } from "@validators/organizer/updateOrganizer.validator";
import { RegisterOrganizerContext } from "@validators/organizer/registerOrganizer.validator";

import { setRefreshTokenCookie } from "@database/organizer/helpers/cookie";

import { ApiErrorCustomResponse, ApiErrorResponse } from "@utils/ApiError";

export const _fetchOrganizer = async (ctx: Context) => {
  const id = ctx.req.param("id");

  try {
    const organizer = await fetchOrganizer(id);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _loginOrganizer = async (ctx: LoginOrganizerContext) => {
  const data = ctx.req.valid("json");

  try {
    const { refreshToken, ...organizer } = await loginOrganizer(data);

    if (refreshToken) {
      await setRefreshTokenCookie(ctx, refreshToken);
    }

    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _registerOrganizer = async (ctx: RegisterOrganizerContext) => {
  const data = ctx.req.valid("json");

  try {
    const organizer = await registerOrganizer(data);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateOrganizer = async (ctx: UpdateOrganizerContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await updateOrganizer(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _removeOrganizer = (ctx: Context) => {
  return ctx.json({});
};
