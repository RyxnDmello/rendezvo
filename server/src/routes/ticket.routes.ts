import { Hono } from "hono";

import {
  _addTicket,
  _fetchTicket,
  _fetchTickets,
  _updateTicket,
  _toggleTicket,
  _deleteTicket,
} from "@controllers/ticket.controller";

import { authorizeOrganizer } from "@middlewares/authorize.middleware";

import addTicketValidator from "@validators/ticket/addTicket.validator";
import updateTicketValidator from "@validators/ticket/updateTicket.validator";

const router = new Hono();

router
  .basePath("/")
  .get(authorizeOrganizer, _fetchTickets)
  .post(authorizeOrganizer, addTicketValidator, _addTicket);
router
  .basePath("/:ticketID")
  .get(authorizeOrganizer, _fetchTicket)
  .patch(authorizeOrganizer, updateTicketValidator, _updateTicket)
  .delete(authorizeOrganizer, _deleteTicket);
router.basePath("/:ticketID/toggle").patch(authorizeOrganizer, _toggleTicket);

export default router;
