import { Context } from "hono";

import fetchOrganizer from "@database/organizer/fetchOrganizer";
import fetchOrganizers from "@database/organizer/fetchOrganizers";

import loginOrganizer from "@database/organizer/loginOrganizer";
import registerOrganizer from "@database/organizer/registerOrganizer";

import updateOrganizer from "@database/organizer/updateOrganizer";

import { LoginSchema } from "@validators/organizer/login.validator";
import { UpdateSchema } from "@validators/organizer/update.validator";
import { RegisterSchema } from "@validators/organizer/register.validator";

import { ApiErrorResponse } from "@utils/ApiError";

export const _fetchOrganizer = async (ctx: Context) => {
  const id = ctx.req.param("id");

  try {
    const organizer = await fetchOrganizer(id);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchOrganizers = async (ctx: Context) => {
  const limitQuery = ctx.req.query("limit");

  try {
    const limit = limitQuery ? Number(limitQuery) : 0;

    if (Number.isNaN(limit) || limit < 0) {
      throw new Error("Limit Must Be A Positive Number");
    }

    const organizers = await fetchOrganizers(
      ctx.req.query("name"),
      ctx.req.query("email"),
      limit
    );

    return ctx.json(organizers, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _loginOrganizer = async (ctx: any) => {
  const data = ctx.req.valid("json") as LoginSchema;

  try {
    const organizer = await loginOrganizer(data);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _registerOrganizer = async (ctx: any) => {
  const data = ctx.req.valid("json") as RegisterSchema;

  try {
    const organizer = await registerOrganizer(data);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateOrganizer = async (ctx: any) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("json") as UpdateSchema;

  try {
    const result = await updateOrganizer(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _removeOrganizer = (ctx: Context) => {
  return ctx.json({});
};
