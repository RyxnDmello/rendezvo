import { Hono } from "hono";

import {
  _fetchUser,
  _loginUser,
  _updateUser,
  _removeUser,
  _registerUser,
} from "@controllers/user.controller";

import {
  _createResetVerification,
  _verifyResetVerification,
  _verifyForgotVerification,
  _createAccountVerification,
  _verifyAccountVerification,
} from "@controllers/verification.controller";

import {
  _revokeSession,
  _refreshSession,
} from "@controllers/session.controller";

import { authorizeUser } from "@middlewares/authorize.middleware";

import loginUserValidator from "@validators/user/loginUser.validator";
import updateUserValidator from "@validators/user/updateUser.validator";
import registerUserValidator from "@validators/user/registerUser.validator";

import verifyResetVerificationValidator from "@validators/verification/verifyResetVerification.validator";
import verifyForgotVerificationValidator from "@validators/verification/verifyForgotVerification.validator";
import verifyAccountVerificationValidator from "@validators/verification/verifyAccountVerification.validator";

const router = new Hono();

router.post("/login", loginUserValidator, _loginUser);
router.post("/register", registerUserValidator, _registerUser);
router
  .basePath("/")
  .get(authorizeUser, _fetchUser)
  .patch(authorizeUser, updateUserValidator, _updateUser)
  .delete(authorizeUser, _removeUser);

router
  .basePath("/:id/verification")
  .post(_createAccountVerification("user"))
  .patch(
    verifyAccountVerificationValidator,
    _verifyAccountVerification("user"),
  );
router
  .basePath("/:id/forgot")
  .post(_createResetVerification("user"))
  .patch(verifyForgotVerificationValidator, _verifyForgotVerification("user"));
router
  .basePath("/reset")
  .post(authorizeUser, _createResetVerification("user"))
  .patch(
    authorizeUser,
    verifyResetVerificationValidator,
    _verifyResetVerification("user"),
  );

router
  .basePath("/session")
  .patch(_refreshSession("user"))
  .delete(_revokeSession("user"));

export default router;
