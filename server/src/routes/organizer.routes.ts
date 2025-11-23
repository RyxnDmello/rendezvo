import { Hono } from "hono";

import {
  _fetchOrganizer,
  _loginOrganizer,
  _updateOrganizer,
  _removeOrganizer,
  _registerOrganizer,
  _uploadOrganizerMedia,
  _deleteOrganizerMedia,
  _uploadOrganizerBanner,
  _deleteOrganizerBanner,
  _uploadOrganizerProfile,
  _deleteOrganizerProfile,
} from "@controllers/organizer.controller";

import authorize from "@middlewares/authorize.middleware";

import loginOrganizerValidator from "@validators/organizer/loginOrganizer.validator";
import updateOrganizerValidator from "@validators/organizer/updateOrganizer.validator";
import registerOrganizerValidator from "@validators/organizer/registerOrganizer.validator";
import uploadOrganizerMediaValidator from "@validators/organizer/media/uploadOrganizerMedia.validator";
import uploadOrganizerBannerValidator from "@validators/organizer/media/uploadOrganizerBanner.validator";
import uploadOrganizerProfileValidator from "@validators/organizer/media/uploadOrganizerProfile.validator";

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
  .patch(authorize, uploadOrganizerMediaValidator, _uploadOrganizerMedia)
  .delete(authorize, _deleteOrganizerMedia);
router
  .basePath("/:id/media/banner")
  .patch(authorize, uploadOrganizerBannerValidator, _uploadOrganizerBanner)
  .delete(authorize, _deleteOrganizerBanner);
router
  .basePath("/:id/media/profile")
  .patch(authorize, uploadOrganizerProfileValidator, _uploadOrganizerProfile)
  .delete(authorize, _deleteOrganizerProfile);

export default router;
