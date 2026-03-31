import { Context } from "hono";
import { getConnInfo } from "hono/bun";

import fetchOrganizer from "@services/organizer/fetchOrganizer";
import loginOrganizer from "@services/organizer/loginOrganizer";
import updateOrganizer from "@services/organizer/updateOrganizer";
import registerOrganizer from "@services/organizer/registerOrganizer";

import uploadOrganizerMedia from "@services/organizer/media/uploadOrganizerMedia";
import uploadOrganizerBanner from "@services/organizer/media/uploadOrganizerBanner";
import uploadOrganizerProfile from "@services/organizer/media/uploadOrganizerProfile";

import deleteOrganizerMedia from "@services/organizer/media/deleteOrganizerMedia";
import deleteOrganizerBanner from "@services/organizer/media/deleteOrganizerBanner";
import deleteOrganizerProfile from "@services/organizer/media/deleteOrganizerProfile";

import { LoginOrganizerContext } from "@validators/organizer/loginOrganizer.validator";
import { UpdateOrganizerContext } from "@validators/organizer/updateOrganizer.validator";
import { RegisterOrganizerContext } from "@validators/organizer/registerOrganizer.validator";
import { UploadOrganizerMediaContext } from "@validators/organizer/media/uploadOrganizerMedia.validator";
import { UploadOrganizerBannerContext } from "@validators/organizer/media/uploadOrganizerBanner.validator";
import { UploadOrganizerProfileContext } from "@validators/organizer/media/uploadOrganizerProfile.validator";

import { setSessionCookie } from "@services/organizer/helpers/cookie";

import ApiError from "@utils/ApiError";

export const _fetchOrganizer = async (ctx: Context) => {
  const user = ctx.get("user");

  const organizer = await fetchOrganizer(user.id);
  return ctx.json(organizer, 200);
};

export const _loginOrganizer = async (ctx: LoginOrganizerContext) => {
  const ip = getConnInfo(ctx).remote.address;

  const data = ctx.req.valid("json");

  if (!ip) {
    throw new ApiError("User IP Address Must Be Provided", "BAD_REQUEST");
  }

  const { refreshToken, ...organizer } = await loginOrganizer(ip, data);

  if (refreshToken) {
    await setSessionCookie(ctx, refreshToken);
  }

  return ctx.json(organizer, 200);
};

export const _registerOrganizer = async (ctx: RegisterOrganizerContext) => {
  const data = ctx.req.valid("json");

  const organizer = await registerOrganizer(data);
  return ctx.json(organizer, 200);
};

export const _updateOrganizer = async (ctx: UpdateOrganizerContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await updateOrganizer(user.id, data);
  return ctx.json(result, 200);
};

export const _uploadOrganizerMedia = async (
  ctx: UploadOrganizerMediaContext,
) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("form");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await uploadOrganizerMedia(user.id, data);
  return ctx.json(result, 200);
};

export const _uploadOrganizerBanner = async (
  ctx: UploadOrganizerBannerContext,
) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("form");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await uploadOrganizerBanner(user.id, data);
  return ctx.json(result, 200);
};

export const _uploadOrganizerProfile = async (
  ctx: UploadOrganizerProfileContext,
) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("form");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await uploadOrganizerProfile(user.id, data);
  return ctx.json(result, 200);
};

export const _deleteOrganizerMedia = async (ctx: Context) => {
  const user = ctx.get("user");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteOrganizerMedia(user.id);
  return ctx.json(result, 200);
};

export const _deleteOrganizerBanner = async (ctx: Context) => {
  const user = ctx.get("user");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteOrganizerBanner(user.id);
  return ctx.json(result, 200);
};

export const _deleteOrganizerProfile = async (ctx: Context) => {
  const user = ctx.get("user");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteOrganizerProfile(user.id);
  return ctx.json(result, 200);
};

export const _removeOrganizer = (ctx: Context) => {
  return ctx.json({});
};
