import { Context } from "hono";

import fetchEvent from "@database/event/fetchEvent";
import fetchEvents from "@database/event/fetchEvents";
import createEvent from "@database/event/createEvent";
import updateEvent from "@database/event/updateEvent";

import uploadEventMedia from "@database/event/media/uploadEventMedia";
import uploadEventCover from "@database/event/media/uploadEventCover";
import uploadEventImage from "@database/event/media/uploadEventImage";
import uploadEventVideo from "@database/event/media/uploadEventVideo";
import uploadEventBanner from "@database/event/media/uploadEventBanner";

import deleteEventMedia from "@database/event/media/deleteEventMedia";
import deleteEventCover from "@database/event/media/deleteEventCover";
import deleteEventImage from "@database/event/media/deleteEventImage";
import deleteEventVideo from "@database/event/media/deleteEventVideo";
import deleteEventBanner from "@database/event/media/deleteEventBanner";

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

import { ApiErrorResponse, ApiErrorCustomResponse } from "@utils/ApiError";

export const _fetchEvent = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const event = await fetchEvent(id, user.id);
    return ctx.json(event, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchEvents = async (ctx: FetchEventsContext) => {
  const user = ctx.get("user");

  const query = ctx.req.valid("query");

  try {
    const events = await fetchEvents(user.id, query);
    return ctx.json(events, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _createEvent = async (ctx: CreateEventContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  try {
    const result = await createEvent(user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateEvent = async (ctx: UpdateEventContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await updateEvent(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventMedia = async (ctx: UploadEventMediaContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventMedia(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventCover = async (ctx: UploadEventCoverContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventCover(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventBanner = async (ctx: UploadEventBannerContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventBanner(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventImage = async (ctx: UploadEventImageContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventImage(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventVideo = async (ctx: UploadEventVideoContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventVideo(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventMedia = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventMedia(id, user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventCover = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventCover(id, user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventBanner = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventBanner(id, user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventImage = async (ctx: DeleteEventImageContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventImage(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventVideo = async (ctx: DeleteEventVideoContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventVideo(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
