import { Context } from "hono";

import fetchOrganizer from "@database/organizer/fetchOrganizer";
import loginOrganizer from "@database/organizer/loginOrganizer";
import updateOrganizer from "@database/organizer/updateOrganizer";
import registerOrganizer from "@database/organizer/registerOrganizer";

import uploadOrganizerMedia from "@database/organizer/media/uploadOrganizerMedia";
import uploadOrganizerBanner from "@database/organizer/media/uploadOrganizerBanner";
import uploadOrganizerProfile from "@database/organizer/media/uploadOrganizerProfile";

import deleteOrganizerMedia from "@database/organizer/media/deleteOrganizerMedia";
import deleteOrganizerBanner from "@database/organizer/media/deleteOrganizerBanner";
import deleteOrganizerProfile from "@database/organizer/media/deleteOrganizerProfile";

import { LoginOrganizerContext } from "@validators/organizer/loginOrganizer.validator";
import { UpdateOrganizerContext } from "@validators/organizer/updateOrganizer.validator";
import { RegisterOrganizerContext } from "@validators/organizer/registerOrganizer.validator";
import { UploadOrganizerMediaContext } from "@validators/organizer/media/uploadOrganizerMedia.validator";
import { UploadOrganizerBannerContext } from "@validators/organizer/media/uploadOrganizerBanner.validator";
import { UploadOrganizerProfileContext } from "@validators/organizer/media/uploadOrganizerProfile.validator";

import { setSessionCookie } from "@database/organizer/helpers/cookie";

import { ApiErrorCustomResponse, ApiErrorResponse } from "@utils/ApiError";

export const _fetchOrganizer = async (ctx: Context) => {
  const user = ctx.get("user");

  try {
    const organizer = await fetchOrganizer(user.id);
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
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  try {
    if (!user.id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await updateOrganizer(user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadOrganizerMedia = async (
  ctx: UploadOrganizerMediaContext
) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("form");

  try {
    if (!user.id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadOrganizerMedia(user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadOrganizerBanner = async (
  ctx: UploadOrganizerBannerContext
) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("form");

  try {
    if (!user.id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadOrganizerBanner(user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadOrganizerProfile = async (
  ctx: UploadOrganizerProfileContext
) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("form");

  try {
    if (!user.id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadOrganizerProfile(user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteOrganizerMedia = async (ctx: Context) => {
  const user = ctx.get("user");

  try {
    if (!user.id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteOrganizerMedia(user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteOrganizerBanner = async (ctx: Context) => {
  const user = ctx.get("user");

  try {
    if (!user.id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteOrganizerBanner(user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteOrganizerProfile = async (ctx: Context) => {
  const user = ctx.get("user");

  try {
    if (!user.id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteOrganizerProfile(user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _removeOrganizer = (ctx: Context) => {
  return ctx.json({});
};
