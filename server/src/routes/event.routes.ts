import { Hono } from "hono";

import {
  _fetchEvent,
  _fetchEvents,
  _createEvent,
} from "@controllers/event.controller";

import authorize from "@middlewares/authorize.middleware";

import fetchEventsValidator from "@validators/event/fetchEvents.validator";
import createEventValidator from "@validators/event/createEvent.validator";

const router = new Hono();

router
  .basePath("/")
  .get(authorize, fetchEventsValidator, _fetchEvents)
  .post(authorize, createEventValidator, _createEvent);
router.basePath("/:id").get(authorize, _fetchEvent);

export default router;
