import { Context } from "hono";

import fetchTicket from "@database/ticket/fetchTicket";
import fetchTickets from "@database/ticket/fetchTickets";

import addTicket from "@database/ticket/addTicket";
import updateTicket from "@database/ticket/updateTicket";
import toggleTicket from "@database/ticket/toggleTicket";
import deleteTicket from "@database/ticket/deleteTicket";

import { AddTicketContext } from "@validators/ticket/addTicket.validator";
import { UpdateTicketContext } from "@validators/ticket/updateTicket.validator";

import { ApiErrorResponse, ApiErrorCustomResponse } from "@utils/ApiError";

export const _fetchTicket = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const ticketID = ctx.req.param("ticketID");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!ticketID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Ticket ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const ticket = await fetchTicket(id, ticketID, user.id);
    return ctx.json(ticket, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchTickets = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const ticket = await fetchTickets(id, user.id);
    return ctx.json(ticket, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _addTicket = async (ctx: AddTicketContext) => {
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

    const result = await addTicket(id, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateTicket = async (ctx: UpdateTicketContext) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const ticketID = ctx.req.param("ticketID");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!ticketID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Ticket ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await updateTicket(id, ticketID, user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _toggleTicket = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const ticketID = ctx.req.param("ticketID");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!ticketID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Ticket ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await toggleTicket(id, ticketID, user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteTicket = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  const ticketID = ctx.req.param("ticketID");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!ticketID) {
      return ApiErrorCustomResponse(ctx, {
        error: "Ticket ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await deleteTicket(id, ticketID, user.id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
