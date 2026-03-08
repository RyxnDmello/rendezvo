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

import { authorizeOrganizer } from "@middlewares/authorize.middleware";

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
  .basePath("/")
  .get(authorizeOrganizer, _fetchOrganizer)
  .patch(authorizeOrganizer, updateOrganizerValidator, _updateOrganizer)
  .delete(authorizeOrganizer, _removeOrganizer);
router
  .basePath("/media")
  .patch(
    authorizeOrganizer,
    uploadOrganizerMediaValidator,
    _uploadOrganizerMedia,
  )
  .delete(authorizeOrganizer, _deleteOrganizerMedia);
router
  .basePath("/media/banner")
  .patch(
    authorizeOrganizer,
    uploadOrganizerBannerValidator,
    _uploadOrganizerBanner,
  )
  .delete(authorizeOrganizer, _deleteOrganizerBanner);
router
  .basePath("/media/profile")
  .patch(
    authorizeOrganizer,
    uploadOrganizerProfileValidator,
    _uploadOrganizerProfile,
  )
  .delete(authorizeOrganizer, _deleteOrganizerProfile);

export default router;
