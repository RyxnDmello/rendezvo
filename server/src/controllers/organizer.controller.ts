import { Context } from "hono";

import fetchOrganizer from "@database/organizer/fetchOrganizer";
import loginOrganizer from "@database/organizer/loginOrganizer";
import updateOrganizer from "@database/organizer/updateOrganizer";
import registerOrganizer from "@database/organizer/registerOrganizer";

import uploadOrganizerMedia from "@database/organizer/media/uploadOrganizerMedia";
import deleteOrganizerMedia from "@database/organizer/media/deleteOrganizerMedia";

import { LoginOrganizerContext } from "@validators/organizer/loginOrganizer.validator";
import { UpdateOrganizerContext } from "@validators/organizer/updateOrganizer.validator";
import { RegisterOrganizerContext } from "@validators/organizer/registerOrganizer.validator";
import { UpdateOrganizerMediaContext } from "@validators/organizer/updateOrganizerMedia.validator";

import { setSessionCookie } from "@database/organizer/helpers/cookie";

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
      await setSessionCookie(ctx, refreshToken);
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

export const _uploadOrganizerMedia = async (
  ctx: UpdateOrganizerMediaContext
) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadOrganizerMedia(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteOrganizerMedia = async (ctx: Context) => {
  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteOrganizerMedia(id);
    return ctx.json(result, 200);
  } catch (error) {
    console.log(error);

    return ApiErrorResponse(ctx, error);
  }
};

export const _removeOrganizer = (ctx: Context) => {
  return ctx.json({});
};
