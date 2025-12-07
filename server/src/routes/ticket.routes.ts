import { Hono } from "hono";

import {
  _addTicket,
  _fetchTicket,
  _fetchTickets,
  _updateTicket,
  _toggleTicket,
  _deleteTicket,
} from "@controllers/ticket.controller";

import authorize from "@middlewares/authorize.middleware";

import fetchTicketValidator from "@validators/ticket/fetchTicket.validator";
import fetchTicketsValidator from "@validators/ticket/fetchTickets.validator";

import addTicketValidator from "@validators/ticket/addTicket.validator";
import updateTicketValidator from "@validators/ticket/updateTicket.validator";
import toggleTicketValidator from "@validators/ticket/toggleTicket.validator";
import deleteTicketValidator from "@validators/ticket/deleteTicket.validator";

const router = new Hono();

router
  .basePath("/")
  .get(authorize, fetchTicketsValidator, _fetchTickets)
  .post(authorize, addTicketValidator, _addTicket);
router
  .basePath("/:ticketID")
  .get(authorize, fetchTicketValidator, _fetchTicket)
  .patch(authorize, updateTicketValidator, _updateTicket)
  .delete(authorize, deleteTicketValidator, _deleteTicket);
router
  .basePath("/:ticketID/toggle")
  .patch(authorize, toggleTicketValidator, _toggleTicket);

export default router;
