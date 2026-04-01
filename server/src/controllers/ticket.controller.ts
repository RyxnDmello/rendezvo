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

/**
 * A controller function that fetches a ticket of an event.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A response of the retrieved ticket.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 * - An ApiError if ticket ID is not provided.
 */
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

/**
 * A controller function that fetches all the tickets of an event.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A response of all the retrieved tickets.
 *
 * @throws An ApiError if event ID is not provided.
 */
export const _fetchTickets = async (ctx: Context) => {
  const user = ctx.get("user");

  const eventID = ctx.req.param("id");

  if (!eventID) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const ticket = await fetchTickets(eventID, user.id);
  return ctx.json(ticket, 200);
};

/**
 * A controller function that adds a new ticket to an event.
 *
 * @param {AddTicketContext} ctx - A hono context with AddTicketContext type support.
 *
 * @returns A success response if the ticket is added.
 *
 * @throws An ApiError if event ID is not provided.
 */
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

/**
 * A controller function that updates a ticket of an event.
 *
 * @param {UpdateTicketContext} ctx - A hono context with UpdateTicketContext type support.
 *
 * @returns A success response if the ticket is updated.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 * - An ApiError if ticket ID is not provided.
 */
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

/**
 * A controller function that toggles a ticket of an event.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the ticket is toggled.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 * - An ApiError if ticket ID is not provided.
 */
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

/**
 * A controller function that deletes a ticket of an event.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A success response if the ticket is deleted.
 *
 * @throws
 * - An ApiError if event ID is not provided.
 * - An ApiError if ticket ID is not provided.
 */
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
