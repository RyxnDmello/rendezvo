import { Context } from "hono";

import fetchEvent from "@database/event/fetchEvent";
import fetchEvents from "@database/event/fetchEvents";

import createEvent from "@database/event/createEvent";
import updateEvent from "@database/event/updateEvent";

import { FetchEventsContext } from "@validators/event/fetchEvents.validator";
import { CreateEventContext } from "@validators/event/createEvent.validator";
import { UpdateEventContext } from "@validators/event/updateEvent.validator";

import { ApiErrorResponse } from "@utils/ApiError";

export const _fetchEvent = async (ctx: Context) => {
  const id = ctx.req.param("id");

  try {
    const event = await fetchEvent(id);
    return ctx.json(event, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchEvents = async (ctx: FetchEventsContext) => {
  const { ownerID, mode, status, visibility, attendance, approved, name } =
    ctx.req.valid("query");

  try {
    const events = await fetchEvents(
      ownerID,
      mode,
      status,
      visibility,
      attendance,
      approved,
      name
    );

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
  const id = ctx.req.param("id")!;

  const data = ctx.req.valid("json");

  try {
    const result = await updateEvent(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
