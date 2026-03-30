import { Context } from "hono";
import { getConnInfo } from "hono/bun";

import createUserResetVerification from "@database/user/verification/createResetVerification";
import createUserForgotVerification from "@database/user/verification/createForgotVerification";
import createUserAccountVerification from "@database/user/verification/createAccountVerification";
import createOrganizerResetVerification from "@database/organizer/verification/createResetVerification";
import createOrganizerForgotVerification from "@database/organizer/verification/createForgotVerification";
import createOrganizerAccountVerification from "@database/organizer/verification/createAccountVerification";

import verifyUserResetVerification from "@database/user/verification/verifyResetVerification";
import verifyUserForgotVerification from "@database/user/verification/verifyForgotVerification";
import verifyUserAccountVerification from "@database/user/verification/verifyAccountVerification";
import verifyOrganizerResetVerification from "@database/organizer/verification/verifyResetVerification";
import verifyOrganizerForgotVerification from "@database/organizer/verification/verifyForgotVerification";
import verifyOrganizerAccountVerification from "@database/organizer/verification/verifyAccountVerification";

import { CreateResetVerificationContext } from "@validators/verification/createResetVerification.validator";
import { VerifyResetVerificationContext } from "@validators/verification/verifyResetVerification.validator";
import { VerifyForgotVerificationContext } from "@validators/verification/verifyForgotVerification.validator";
import { VerifyAccountVerificationContext } from "@validators/verification/verifyAccountVerification.validator";

import { setSessionCookie as setUserSessionCookie } from "@database/user/helpers/cookie";
import { setSessionCookie as setOrganizerSessionCookie } from "@database/organizer/helpers/cookie";

import { ApiErrorResponse, ApiErrorCustomResponse } from "@utils/ApiError";

import { Role } from "@constants/user";

export const _createAccountVerification = (role: Role) => {
  return async (ctx: Context) => {
    const id = ctx.req.param("id");

    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    try {
      let result = null;

      switch (role) {
        case "user":
          result = await createUserAccountVerification(id);
          break;

        case "organizer":
          result = await createOrganizerAccountVerification(id);
          break;

        default:
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role Provided",
            code: "BAD_REQUEST",
          });
      }

      return ctx.json(result, 200);
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};

export const _createForgotVerification = (role: Role) => {
  return async (ctx: Context) => {
    const id = ctx.req.param("id");

    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    try {
      let result = null;

      switch (role) {
        case "user":
          result = await createUserForgotVerification(id);
          break;

        case "organizer":
          result = await createOrganizerForgotVerification(id);
          break;

        default:
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role Provided",
            code: "BAD_REQUEST",
          });
      }

      return ctx.json(result, 200);
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};

export const _createResetVerification = (role: Role) => {
  return async (ctx: CreateResetVerificationContext) => {
    const user = ctx.get("user");

    const data = ctx.req.valid("json");

    try {
      let result = null;

      switch (role) {
        case "user":
          result = await createUserResetVerification(user.id, data);
          break;

        case "organizer":
          result = await createOrganizerResetVerification(user.id, data);
          break;

        default:
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role Provided",
            code: "BAD_REQUEST",
          });
      }

      return ctx.json(result, 200);
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};

export const _verifyAccountVerification = (role: Role) => {
  return async (ctx: VerifyAccountVerificationContext) => {
    const ip = getConnInfo(ctx).remote.address;

    const id = ctx.req.param("id");

    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    if (!ip) {
      return ApiErrorCustomResponse(ctx, {
        error: "User IP Address Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const data = ctx.req.valid("json");

    try {
      let result = null;

      switch (role) {
        case "user":
          result = await verifyUserAccountVerification(ip, id, data);
          break;

        case "organizer":
          result = await verifyOrganizerAccountVerification(ip, id, data);
          break;

        default:
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role Provided",
            code: "BAD_REQUEST",
          });
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
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role Provided",
            code: "BAD_REQUEST",
          });
      }

      return ctx.json(payload, 200);
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};

export const _verifyForgotVerification = (role: Role) => {
  return async (ctx: VerifyForgotVerificationContext) => {
    const id = ctx.req.param("id");

    if (!id) {
      return ApiErrorCustomResponse(ctx, {
        error: "User ID Must Be Provided",
        code: "BAD_REQUEST",
      });
    }

    const data = ctx.req.valid("json");

    try {
      let result = null;

      switch (role) {
        case "user":
          result = await verifyUserForgotVerification(id, data);
          break;

        case "organizer":
          result = await verifyOrganizerForgotVerification(id, data);
          break;

        default:
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role Provided",
            code: "BAD_REQUEST",
          });
      }

      return ctx.json(result, 200);
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};

export const _verifyResetVerification = (role: Role) => {
  return async (ctx: VerifyResetVerificationContext) => {
    const user = ctx.get("user");

    const data = ctx.req.valid("json");

    try {
      let result = null;

      switch (role) {
        case "user":
          result = await verifyUserResetVerification(user.id, data);
          break;

        case "organizer":
          result = await verifyOrganizerResetVerification(user.id, data);
          break;

        default:
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role Provided",
            code: "BAD_REQUEST",
          });
      }

      return ctx.json(result, 200);
    } catch (error) {
      return ApiErrorResponse(ctx, error);
    }
  };
};
