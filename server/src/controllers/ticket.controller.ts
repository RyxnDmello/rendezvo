import { Context } from "hono";

import fetchTicket from "@services/ticket/fetchTicket";
import fetchTickets from "@services/ticket/fetchTickets";

import addTicket from "@services/ticket/addTicket";
import updateTicket from "@services/ticket/updateTicket";
import toggleTicket from "@services/ticket/toggleTicket";
import deleteTicket from "@services/ticket/deleteTicket";

import { AddTicketContext } from "@validators/ticket/addTicket.validator";
import { UpdateTicketContext } from "@validators/ticket/updateTicket.validator";

import ApiError from "@utils/ApiError";

export const _fetchTicket = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");
  const ticketID = ctx.req.param("ticketID");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  if (!ticketID) {
    throw new ApiError("Ticket ID Must Be Provided", "BAD_REQUEST");
  }

  const ticket = await fetchTicket(ticketID, eventID, user.id);
  return ctx.json(ticket, 200);
};

export const _fetchTickets = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const ticket = await fetchTickets(eventID, user.id);
  return ctx.json(ticket, 200);
};

export const _addTicket = async (ctx: AddTicketContext) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  const data = ctx.req.valid("json");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await addTicket(eventID, user.id, data);
  return ctx.json(result, 200);
};

export const _updateTicket = async (ctx: UpdateTicketContext) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");
  const ticketID = ctx.req.param("ticketID");

  const data = ctx.req.valid("json");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  if (!ticketID) {
    throw new ApiError("Ticket ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await updateTicket(ticketID, eventID, user.id, data);
  return ctx.json(result, 200);
};

export const _toggleTicket = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");
  const ticketID = ctx.req.param("ticketID");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  if (!ticketID) {
    throw new ApiError("Ticket ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await toggleTicket(ticketID, eventID, user.id);
  return ctx.json(result, 200);
};

export const _deleteTicket = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");
  const ticketID = ctx.req.param("ticketID");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  if (!ticketID) {
    throw new ApiError("Ticket ID Must Be Provided", "BAD_REQUEST");
  }

  const result = await deleteTicket(ticketID, eventID, user.id);
  return ctx.json(result, 200);
};
