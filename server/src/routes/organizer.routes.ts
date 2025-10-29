import { Hono } from "hono";

import {
  _fetchOrganizer,
  _loginOrganizer,
  _registerOrganizer,
  _updateOrganizer,
  _removeOrganizer,
} from "@controllers/organizer.controller";

import authorize from "@middlewares/authorize.middleware";

import loginOrganizerValidator from "@validators/organizer/loginOrganizer.validator";
import updateOrganizerValidator from "@validators/organizer/updateOrganizer.validator";
import registerOrganizerValidator from "@validators/organizer/registerOrganizer.validator";

const router = new Hono();

router.post("/login", loginOrganizerValidator, _loginOrganizer);
router.post("/register", registerOrganizerValidator, _registerOrganizer);
router
  .basePath("/:id")
  .get(authorize, _fetchOrganizer)
  .patch(authorize, updateOrganizerValidator, _updateOrganizer)
  .delete(authorize, _removeOrganizer);

export default router;
