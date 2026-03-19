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

import {
  _createResetVerification,
  _verifyResetVerification,
  _createForgotVerification,
  _verifyForgotVerification,
  _createAccountVerification,
  _verifyAccountVerification,
} from "@controllers/verification.controller";

import { authorizeOrganizer } from "@middlewares/authorize.middleware";

import loginOrganizerValidator from "@validators/organizer/loginOrganizer.validator";
import updateOrganizerValidator from "@validators/organizer/updateOrganizer.validator";
import registerOrganizerValidator from "@validators/organizer/registerOrganizer.validator";
import uploadOrganizerMediaValidator from "@validators/organizer/media/uploadOrganizerMedia.validator";
import uploadOrganizerBannerValidator from "@validators/organizer/media/uploadOrganizerBanner.validator";
import uploadOrganizerProfileValidator from "@validators/organizer/media/uploadOrganizerProfile.validator";

import createResetVerificationValidator from "@validators/verification/createResetVerification.validator";
import verifyResetVerificationValidator from "@validators/verification/verifyResetVerification.validator";
import verifyForgotVerificationValidator from "@validators/verification/verifyForgotVerification.validator";
import verifyAccountVerificationValidator from "@validators/verification/verifyAccountVerification.validator";

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

router
  .basePath("/:id/verification")
  .post(_createAccountVerification("organizer"))
  .patch(
    verifyAccountVerificationValidator,
    _verifyAccountVerification("organizer"),
  );
router
  .basePath("/:id/forgot")
  .post(_createForgotVerification("organizer"))
  .patch(
    verifyForgotVerificationValidator,
    _verifyForgotVerification("organizer"),
  );
router
  .basePath("/reset")
  .post(
    authorizeOrganizer,
    createResetVerificationValidator,
    _createResetVerification("organizer"),
  )
  .patch(
    authorizeOrganizer,
    verifyResetVerificationValidator,
    _verifyResetVerification("organizer"),
  );

export default router;
