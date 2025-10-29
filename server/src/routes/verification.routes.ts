import { Hono } from "hono";

import {
  _createAuthVerification,
  _createResetVerification,
  _createForgotVerification,
  _verifyAuthVerification,
  _verifyResetVerification,
  _verifyForgotVerification,
} from "@controllers/verification.controller";

import authorize from "@middlewares/authorize.middleware";

import createAuthVerificationValidator from "@validators/verification/createAuthVerification.validator";
import createResetVerificationValidator from "@validators/verification/createResetVerification.validator";
import createForgotVerificationValidator from "@validators/verification/createForgotVerification.validator";
import verifyAuthVerificationValidator from "@validators/verification/verifyAuthVerification.validator";
import verifyResetVerificationValidator from "@validators/verification/verifyResetVerification.validator";
import verifyForgotVerificationValidator from "@validators/verification/verifyForgotVerification.validator";

const router = new Hono();

router.post("/auth", createAuthVerificationValidator, _createAuthVerification);
router.post(
  "/reset",
  createResetVerificationValidator,
  _createResetVerification
);
router.post(
  "/forgot",
  createForgotVerificationValidator,
  _createForgotVerification
);
router.post(
  "/auth/verify",
  verifyAuthVerificationValidator,
  _verifyAuthVerification
);
router.post(
  "/reset/verify",
  authorize,
  verifyResetVerificationValidator,
  _verifyResetVerification
);
router.post(
  "/forgot/verify",
  verifyForgotVerificationValidator,
  _verifyForgotVerification
);

export default router;
