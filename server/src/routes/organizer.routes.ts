import { Hono } from "hono";

import {
  _fetchOrganizer,
  _fetchOrganizers,
  _loginOrganizer,
  _registerOrganizer,
  _updateOrganizer,
  _removeOrganizer,
} from "@controllers/organizer.controller";

import loginOrganizerValidator from "@validators/organizer/loginOrganizer.validator";
import updateOrganizerValidator from "@validators/organizer/updateOrganizer.validator";
import registerOrganizerValidator from "@validators/organizer/registerOrganizer.validator";

const router = new Hono();

router.basePath("/").get(_fetchOrganizers);
router.post("/login", loginOrganizerValidator, _loginOrganizer);
router.post("/register", registerOrganizerValidator, _registerOrganizer);
router
  .basePath("/:id")
  .get(_fetchOrganizer)
  .patch(updateOrganizerValidator, _updateOrganizer)
  .delete(_removeOrganizer);

export default router;
