import { ZodContext } from "hono";

import fetchOrganizer from "@database/organizer/fetchOrganizer";
import fetchOrganizers from "@database/organizer/fetchOrganizers";

import loginOrganizer from "@database/organizer/loginOrganizer";
import registerOrganizer from "@database/organizer/registerOrganizer";

import updateOrganizer from "@database/organizer/updateOrganizer";

import { LoginOrganizerValidatorSchema } from "@validators/organizer/loginOrganizer.validator";
import { UpdateOrganizerValidatorSchema } from "@validators/organizer/updateOrganizer.validator";
import { RegisterOrganizerValidatorSchema } from "@validators/organizer/registerOrganizer.validator";

import { ApiErrorResponse } from "@utils/ApiError";

export const _fetchOrganizer = async (ctx: ZodContext) => {
  const id = ctx.req.param("id");

  try {
    const organizer = await fetchOrganizer(id);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchOrganizers = async (ctx: ZodContext) => {
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

export const _loginOrganizer = async (
  ctx: ZodContext<LoginOrganizerValidatorSchema>
) => {
  const data = ctx.req.valid("json");

  try {
    const organizer = await loginOrganizer(data);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _registerOrganizer = async (
  ctx: ZodContext<RegisterOrganizerValidatorSchema>
) => {
  const data = ctx.req.valid("json");

  try {
    const organizer = await registerOrganizer(data);
    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateOrganizer = async (
  ctx: ZodContext<UpdateOrganizerValidatorSchema>
) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    const result = await updateOrganizer(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _removeOrganizer = (ctx: ZodContext) => {
  return ctx.json({});
};
