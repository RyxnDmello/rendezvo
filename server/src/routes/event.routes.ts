import { Hono } from "hono";

import {
  _fetchEvent,
  _fetchEvents,
  _createEvent,
} from "@controllers/event.controller";

import fetchEventsValidator from "@validators/event/fetchEvents.validator";
import createEventValidator from "@validators/event/createEvent.validator";

const router = new Hono();

router
  .basePath("/")
  .get(fetchEventsValidator, _fetchEvents)
  .post(createEventValidator, _createEvent);
router.get("/:id", _fetchEvent);

export default router;
