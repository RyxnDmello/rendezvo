import { Context } from "hono";
import { getConnInfo } from "hono/bun";

import { Role } from "@constants/user";

import createUserResetVerification from "@services/user/verification/createResetVerification";
import createUserAccountVerification from "@services/user/verification/createAccountVerification";
import createOrganizerResetVerification from "@services/organizer/verification/createResetVerification";
import createOrganizerAccountVerification from "@services/organizer/verification/createAccountVerification";

import verifyUserResetVerification from "@services/user/verification/verifyResetVerification";
import verifyUserForgotVerification from "@services/user/verification/verifyForgotVerification";
import verifyUserAccountVerification from "@services/user/verification/verifyAccountVerification";
import verifyOrganizerResetVerification from "@services/organizer/verification/verifyResetVerification";
import verifyOrganizerForgotVerification from "@services/organizer/verification/verifyForgotVerification";
import verifyOrganizerAccountVerification from "@services/organizer/verification/verifyAccountVerification";

import { VerifyResetVerificationContext } from "@validators/verification/verifyResetVerification.validator";
import { VerifyForgotVerificationContext } from "@validators/verification/verifyForgotVerification.validator";
import { VerifyAccountVerificationContext } from "@validators/verification/verifyAccountVerification.validator";

import { setSessionCookie as setUserSessionCookie } from "@services/user/helpers/cookie";
import { setSessionCookie as setOrganizerSessionCookie } from "@services/organizer/helpers/cookie";

import ApiError from "@utils/ApiError";

export const _createAccountVerification = (role: Role) => {
  return async (ctx: Context) => {
    const id = ctx.req.param("id");

    if (!id) {
      throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
    }

    let result = null;

    switch (role) {
      case "user":
        result = await createUserAccountVerification(id);
        break;

      case "organizer":
        result = await createOrganizerAccountVerification(id);
        break;

      default:
        throw new ApiError("Invalid User Role Provided", "BAD_REQUEST");
    }

    return ctx.json(result, 200);
  };
};

export const _createResetVerification = (role: Role) => {
  return async (ctx: Context) => {
    const user = ctx.get("user");

    let result = null;

    switch (role) {
      case "user":
        result = await createUserResetVerification(user.id);
        break;

      case "organizer":
        result = await createOrganizerResetVerification(user.id);
        break;

      default:
        throw new ApiError("Invalid User Role Provided", "BAD_REQUEST");
    }

    return ctx.json(result, 200);
  };
};

export const _verifyAccountVerification = (role: Role) => {
  return async (ctx: VerifyAccountVerificationContext) => {
    const ip = getConnInfo(ctx).remote.address;

    const id = ctx.req.param("id");

    const data = ctx.req.valid("json");

    if (!id) {
      throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
    }

    if (!ip) {
      throw new ApiError("User IP Address Must Be Provided", "BAD_REQUEST");
    }

    let result = null;

    switch (role) {
      case "user":
        result = await verifyUserAccountVerification(ip, id, data);
        break;

      case "organizer":
        result = await verifyOrganizerAccountVerification(ip, id, data);
        break;

      default:
        throw new ApiError("Invalid User Role Provided", "BAD_REQUEST");
    }

    const { refreshToken, ...payload } = result;

    switch (role) {
      case "user":
        await setUserSessionCookie(ctx, refreshToken);
        break;

      case "organizer":
        await setOrganizerSessionCookie(ctx, refreshToken);
        break;

      default:
        throw new ApiError("Invalid User Role Provided", "BAD_REQUEST");
    }

    return ctx.json(payload, 200);
  };
};

export const _verifyForgotVerification = (role: Role) => {
  return async (ctx: VerifyForgotVerificationContext) => {
    const id = ctx.req.param("id");

    const data = ctx.req.valid("json");

    if (!id) {
      throw new ApiError("User ID Must Be Provided", "BAD_REQUEST");
    }

    let result = null;

    switch (role) {
      case "user":
        result = await verifyUserForgotVerification(id, data);
        break;

      case "organizer":
        result = await verifyOrganizerForgotVerification(id, data);
        break;

      default:
        throw new ApiError("Invalid User Role Provided", "BAD_REQUEST");
    }

    return ctx.json(result, 200);
  };
};

export const _verifyResetVerification = (role: Role) => {
  return async (ctx: VerifyResetVerificationContext) => {
    const user = ctx.get("user");

    const data = ctx.req.valid("json");

    let result = null;

    switch (role) {
      case "user":
        result = await verifyUserResetVerification(user.id, data);
        break;

      case "organizer":
        result = await verifyOrganizerResetVerification(user.id, data);
        break;

      default:
        throw new ApiError("Invalid User Role Provided", "BAD_REQUEST");
    }

    return ctx.json(result, 200);
  };
};
