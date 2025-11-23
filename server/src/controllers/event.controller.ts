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
  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const event = await fetchEvent(id);
    return ctx.json(event, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchEvents = async (ctx: FetchEventsContext) => {
  const query = ctx.req.valid("query");

  try {
    const events = await fetchEvents(query);
    return ctx.json(events, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _createEvent = async (ctx: CreateEventContext) => {
  const data = ctx.req.valid("json");

  try {
    const result = await createEvent(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateEvent = async (ctx: UpdateEventContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await updateEvent(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventMedia = async (ctx: UploadEventMediaContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventMedia(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventCover = async (ctx: UploadEventCoverContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventCover(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventBanner = async (ctx: UploadEventBannerContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventBanner(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventImage = async (ctx: UploadEventImageContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventImage(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _uploadEventVideo = async (ctx: UploadEventVideoContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("form");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await uploadEventVideo(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventMedia = async (ctx: Context) => {
  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventMedia(id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventCover = async (ctx: Context) => {
  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventCover(id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventBanner = async (ctx: Context) => {
  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventBanner(id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventImage = async (ctx: DeleteEventImageContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventImage(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteEventVideo = async (ctx: DeleteEventVideoContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteEventVideo(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
