import { Context } from "hono";

import fetchEvent from "@services/event/fetchEvent";
import fetchEvents from "@services/event/fetchEvents";
import createEvent from "@services/event/createEvent";
import updateEvent from "@services/event/updateEvent";

import uploadEventMedia from "@services/event/media/uploadEventMedia";
import uploadEventCover from "@services/event/media/uploadEventCover";
import uploadEventImage from "@services/event/media/uploadEventImage";
import uploadEventVideo from "@services/event/media/uploadEventVideo";
import uploadEventBanner from "@services/event/media/uploadEventBanner";

import deleteEventMedia from "@services/event/media/deleteEventMedia";
import deleteEventCover from "@services/event/media/deleteEventCover";
import deleteEventImage from "@services/event/media/deleteEventImage";
import deleteEventVideo from "@services/event/media/deleteEventVideo";
import deleteEventBanner from "@services/event/media/deleteEventBanner";

import { FetchEventsContext } from "@validators/event/fetchEvents.validator";
import { CreateEventContext } from "@validators/event/createEvent.validator";
import { UpdateEventContext } from "@validators/event/updateEvent.validator";

import { UploadEventMediaContext } from "@validators/event/media/uploadEventMedia.validator";
import { UploadEventCoverContext } from "@validators/event/media/uploadEventCover.validator";
import { UploadEventImageContext } from "@validators/event/media/uploadEventImage.validator";
import { UploadEventVideoContext } from "@validators/event/media/uploadEventVideo.validator";
import { UploadEventBannerContext } from "@validators/event/media/uploadEventBanner.validator";

import { DeleteEventImageContext } from "@validators/event/media/deleteEventImage.validator";
import { DeleteEventVideoContext } from "@validators/event/media/deleteEventVideo.validator";

import ApiError from "@utils/ApiError";

/**
 * A controller function that fetches an event of the organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A response of the retrieved event.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 */
export const _fetchEvent = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const event = await fetchEvent(id, user.id);
  return ctx.json(event, 200);
};

/**
 * A controller function that fetches all the events of the organizer.
 *
 * @param {FetchEventsContext} ctx - A hono context with FetchEventsContext type support.
 *
 * @returns A response of all the retrieved events.
 */
export const _fetchEvents = async (ctx: FetchEventsContext) => {
  const user = ctx.get("user");

  const query = ctx.req.valid("query");

  const events = await fetchEvents(user.id, query);
  return ctx.json(events, 200);
};

/**
 * A controller function that adds a new event under the organizer.
 *
 * @param {CreateEventContext} ctx - A hono context with CreateEventContext type support.
 *
 * @returns A success response if the event is added.
 */
export const _createEvent = async (ctx: CreateEventContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  const result = await createEvent(user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that updates an event of the organizer.
 *
 * @param {UpdateEventContext} ctx - A hono context with UpdateEventContext type support.
 *
 * @returns A success response if the event is updated.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _updateEvent = async (ctx: UpdateEventContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await updateEvent(id, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that uploads the cover and banner image of an event of the organizer.
 *
 * @param {UploadEventMediaContext} ctx - A hono context with UploadEventMediaContext type support.
 *
 * @returns A success response if the media is uploaded.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _uploadEventMedia = async (ctx: UploadEventMediaContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await uploadEventMedia(id, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that uploads the cover image of an event of the organizer.
 *
 * @param {UploadEventCoverContext} ctx - A hono context with UploadEventCoverContext type support.
 *
 * @returns A success response if the cover is uploaded.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _uploadEventCover = async (ctx: UploadEventCoverContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await uploadEventCover(id, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that uploads the banner image of an event of the organizer.
 *
 * @param {UploadEventBannerContext} ctx - A hono context with UploadEventBannerContext type support.
 *
 * @returns A success response if the banner is uploaded.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _uploadEventBanner = async (ctx: UploadEventBannerContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await uploadEventBanner(id, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that uploads an image of an event of the organizer.
 *
 * @param {UploadEventImageContext} ctx - A hono context with UploadEventImageContext type support.
 *
 * @returns A success response if the image is uploaded.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _uploadEventImage = async (ctx: UploadEventImageContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await uploadEventImage(id, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that uploads a video of an event of the organizer.
 *
 * @param {UploadEventVideoContext} ctx - A hono context with UploadEventVideoContext type support.
 *
 * @returns A success response if the video is uploaded.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _uploadEventVideo = async (ctx: UploadEventVideoContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await uploadEventVideo(id, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that deletes the cover and banner image of an event of the organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the media is deleted.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _deleteEventMedia = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteEventMedia(id, user.id);
  return ctx.json(result, 200);
};

/**
 * A controller function that deletes the cover image of an event of the organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the cover is deleted.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _deleteEventCover = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteEventCover(id, user.id);
  return ctx.json(result, 200);
};

/**
 * A controller function that deletes the banner image of an event of the organizer.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the banner is deleted.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _deleteEventBanner = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteEventBanner(id, user.id);
  return ctx.json(result, 200);
};

/**
 * A controller function that deletes an image of an event of the organizer.
 *
 * @param {DeleteEventImageContext} ctx - A hono context with DeleteEventImageContext type support.
 *
 * @returns A success response if the image is deleted.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _deleteEventImage = async (ctx: DeleteEventImageContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteEventImage(id, user.id, data);
  return ctx.json(result, 200);
};

/**
 * A controller function that deletes a video of an event of the organizer.
 *
 * @param {DeleteEventVideoContext} ctx - A hono context with DeleteEventVideoContext type support.
 *
 * @returns A success response if the video is deleted.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _deleteEventVideo = async (ctx: DeleteEventVideoContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteEventVideo(id, user.id, data);
  return ctx.json(result, 200);
};
