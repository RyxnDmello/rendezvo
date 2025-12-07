import fetchTicket from "@database/ticket/fetchTicket";
import fetchTickets from "@database/ticket/fetchTickets";

import addTicket from "@database/ticket/addTicket";
import updateTicket from "@database/ticket/updateTicket";
import toggleTicket from "@database/ticket/toggleTicket";
import deleteTicket from "@database/ticket/deleteTicket";

import { FetchTicketContext } from "@validators/ticket/fetchTicket.validator";
import { FetchTicketsContext } from "@validators/ticket/fetchTickets.validator";

import { AddTicketContext } from "@validators/ticket/addTicket.validator";
import { UpdateTicketContext } from "@validators/ticket/updateTicket.validator";
import { ToggleTicketContext } from "@validators/ticket/toggleTicket.validator";
import { DeleteTicketContext } from "@validators/ticket/deleteTicket.validator";

import { ApiErrorResponse, ApiErrorCustomResponse } from "@utils/ApiError";

export const _fetchTicket = async (ctx: FetchTicketContext) => {
  const id = ctx.req.param("id");

  const ticketID = ctx.req.param("ticketID");

  const query = ctx.req.valid("query");

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

    const ticket = await fetchTicket(id, ticketID, query);
    return ctx.json(ticket, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _fetchTickets = async (ctx: FetchTicketsContext) => {
  const id = ctx.req.param("id");

  const query = ctx.req.valid("query");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const ticket = await fetchTickets(id, query);
    return ctx.json(ticket, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _addTicket = async (ctx: AddTicketContext) => {
  const id = ctx.req.param("id");

  const data = ctx.req.valid("json");

  try {
    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "Event ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const result = await addTicket(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _updateTicket = async (ctx: UpdateTicketContext) => {
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

    const result = await updateTicket(id, ticketID, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _toggleTicket = async (ctx: ToggleTicketContext) => {
  const id = ctx.req.param("id");

  const ticketID = ctx.req.param("ticketID");

  const data = ctx.req.valid("query");

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

    const result = await toggleTicket(id, ticketID, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _deleteTicket = async (ctx: DeleteTicketContext) => {
  const id = ctx.req.param("id");

  const ticketID = ctx.req.param("ticketID");

  const data = ctx.req.valid("query");

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

    const result = await deleteTicket(id, ticketID, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
