import { Hono } from "hono";

import {
  _fetchOrganizer,
  _loginOrganizer,
  _removeOrganizer,
  _updateOrganizer,
  _registerOrganizer,
  _uploadOrganizerMedia,
  _deleteOrganizerMedia,
} from "@controllers/organizer.controller";

import authorize from "@middlewares/authorize.middleware";

import loginOrganizerValidator from "@validators/organizer/loginOrganizer.validator";
import updateOrganizerValidator from "@validators/organizer/updateOrganizer.validator";
import registerOrganizerValidator from "@validators/organizer/registerOrganizer.validator";
import updateOrganizerMediaValidator from "@validators/organizer/updateOrganizerMedia.validator";

const router = new Hono();

router.post("/login", loginOrganizerValidator, _loginOrganizer);
router.post("/register", registerOrganizerValidator, _registerOrganizer);
router
  .basePath("/:id")
  .get(authorize, _fetchOrganizer)
  .patch(authorize, updateOrganizerValidator, _updateOrganizer)
  .delete(authorize, _removeOrganizer);
router
  .basePath("/:id/media")
  .patch(authorize, updateOrganizerMediaValidator, _uploadOrganizerMedia)
  .delete(authorize, _deleteOrganizerMedia);

export default router;
