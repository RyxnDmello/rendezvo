import { ZodContext } from "hono";

import fetchEvent from "@database/event/fetchEvent";
import fetchEvents from "@database/event/fetchEvents";

import createEvent from "@database/event/createEvent";

import { FetchEventsValidatorSchema } from "@validators/event/fetchEvents.validator";
import { CreateEventValidatorSchema } from "@validators/event/createEvent.validator";

import { ApiErrorResponse } from "@utils/ApiError";

export const _fetchEvent = async (ctx: ZodContext) => {
  const id = ctx.req.param("id");

  try {
    const event = await fetchEvent(id);
    return ctx.json(event, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchEvents = async (
  ctx: ZodContext<FetchEventsValidatorSchema>
) => {
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

export const _createEvent = async (
  ctx: ZodContext<CreateEventValidatorSchema>
) => {
  const data = ctx.req.valid("json");

  try {
    const result = await createEvent(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
