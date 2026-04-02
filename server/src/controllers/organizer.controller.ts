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

/**
 * A controller function that retrieves the authenticated organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A response of the retrieved organizer.
 */
export const _fetchOrganizer = async (ctx: Context) => {
  const user = ctx.get("user");

  const organizer = await fetchOrganizer(user.id);
  return ctx.json(organizer, 200);
};

/**
 * A controller function that logs in an organizer.
 *
 * @param {LoginOrganizerContext} ctx - A hono context with LoginOrganizerContext type support.
 *
 * @returns
 * - A response of the logged in organizer, if the organizer is verified.
 * - The ID of the organizer, if the organizer is not verified.
 *
 * @throws An ApiError if user IP address is not provided.
 */
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

/**
 * A controller function that registers a new organizer.
 *
 * @param {RegisterOrganizerContext} ctx - A hono context with RegisterOrganizerContext type support.
 *
 * @returns An acknowledgement response of the created organizer.
 */
export const _registerOrganizer = async (ctx: RegisterOrganizerContext) => {
  const data = ctx.req.valid("json");

  const organizer = await registerOrganizer(data);
  return ctx.json(organizer, 200);
};

/**
 * A controller function that updates the authenticated organizer.
 *
 * @param {UpdateOrganizerContext} ctx - A hono context with UpdateOrganizerContext type support.
 *
 * @returns A success response if the organizer is updated.
 *
 * @throws An ApiError if user ID is not provided.
 */
export const _updateOrganizer = async (ctx: UpdateOrganizerContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await updateOrganizer(user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that uploads the profile and banner image of the authenticated organizer.
 *
 * @param {UploadOrganizerMediaContext} ctx - A hono context with UploadOrganizerMediaContext type support.
 *
 * @returns A success response if the media is uploaded.
 *
 * @throws An ApiError if user ID is not provided.
 */
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

/**
 * A controller function that uploads the banner image of the authenticated organizer.
 *
 * @param {UploadOrganizerBannerContext} ctx - A hono context with UploadOrganizerBannerContext type support.
 *
 * @returns A success response if the banner is uploaded.
 *
 * @throws An ApiError if user ID is not provided.
 */
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

/**
 * A controller function that uploads the profile image of the authenticated organizer.
 *
 * @param {UploadOrganizerProfileContext} ctx - A hono context with UploadOrganizerProfileContext type support.
 *
 * @returns A success response if the profile is uploaded.
 *
 * @throws An ApiError if user ID is not provided.
 */
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

/**
 * A controller function that deletes the profile and banner image of the authenticated organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the media is deleted.
 *
 * @throws An ApiError if user ID is not provided.
 */
export const _deleteOrganizerMedia = async (ctx: Context) => {
  const user = ctx.get("user");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteOrganizerMedia(user.id);
  return ctx.json(result, 200);
};

/**
 * A controller function that deletes the banner image of the authenticated organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the banner is deleted.
 *
 * @throws An ApiError if user ID is not provided.
 */
export const _deleteOrganizerBanner = async (ctx: Context) => {
  const user = ctx.get("user");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteOrganizerBanner(user.id);
  return ctx.json(result, 200);
};

/**
 * A controller function that deletes the profile image of the authenticated organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the profile is deleted.
 *
 * @throws An ApiError if user ID is not provided.
 */
export const _deleteOrganizerProfile = async (ctx: Context) => {
  const user = ctx.get("user");

  if (!user.id) {
    throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteOrganizerProfile(user.id);
  return ctx.json(result, 200);
};

/**
 * A controller function that removes the authenticated organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the organizer is removed.
 */
export const _removeOrganizer = (ctx: Context) => {
  return ctx.json({});
};
