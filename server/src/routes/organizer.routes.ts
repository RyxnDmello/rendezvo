import { Hono } from "hono";

import {
  _fetchOrganizer,
  _fetchOrganizers,
  _loginOrganizer,
  _registerOrganizer,
  _updateOrganizer,
  _removeOrganizer,
} from "@controllers/organizer.controller";

import loginValidator from "@validators/organizer/login.validator";
import updateValidator from "@validators/organizer/update.validator";
import registerValidator from "@validators/organizer/register.validator";

const router = new Hono();

router.basePath("/").get(_fetchOrganizers);
router.post("/login", loginValidator, _loginOrganizer);
router.post("/register", registerValidator, _registerOrganizer);
router
  .basePath("/:id")
  .get(_fetchOrganizer)
  .patch(updateValidator, _updateOrganizer)
  .delete(_removeOrganizer);

export default router;
