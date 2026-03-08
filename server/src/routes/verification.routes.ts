import { Hono } from "hono";

import {
  _createAuthVerification,
  _createResetVerification,
  _createForgotVerification,
  _verifyAuthVerification,
  _verifyResetVerification,
  _verifyForgotVerification,
} from "@controllers/verification.controller";

import { authorizeUser } from "@middlewares/authorize.middleware";

import createResetVerificationValidator from "@validators/verification/createResetVerification.validator";
import verifyAuthVerificationValidator from "@validators/verification/verifyAuthVerification.validator";
import verifyResetVerificationValidator from "@validators/verification/verifyResetVerification.validator";
import verifyForgotVerificationValidator from "@validators/verification/verifyForgotVerification.validator";

const router = new Hono();

router.post("/auth/:id", _createAuthVerification);
router.post("/forgot/:id", _createForgotVerification);
router.post(
  "/reset",
  authorizeUser,
  createResetVerificationValidator,
  _createResetVerification,
);
router.post(
  "/auth/:id/verify",
  verifyAuthVerificationValidator,
  _verifyAuthVerification,
);
router.post(
  "/forgot/:id/verify",
  verifyForgotVerificationValidator,
  _verifyForgotVerification,
);
router.post(
  "/reset/verify",
  authorizeUser,
  verifyResetVerificationValidator,
  _verifyResetVerification,
);

export default router;
