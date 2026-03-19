import { Context } from "hono";

import createOrganizerResetVerification from "@database/organizer/verification/createResetVerification";
import createOrganizerForgotVerification from "@database/organizer/verification/createForgotVerification";
import createOrganizerAccountVerification from "@database/organizer/verification/createAccountVerification";

import verifyOrganizerResetVerification from "@database/organizer/verification/verifyResetVerification";
import verifyOrganizerForgotVerification from "@database/organizer/verification/verifyForgotVerification";
import verifyOrganizerAccountVerification from "@database/organizer/verification/verifyAccountVerification";

import { CreateResetVerificationContext } from "@validators/verification/createResetVerification.validator";
import { VerifyResetVerificationContext } from "@validators/verification/verifyResetVerification.validator";
import { VerifyForgotVerificationContext } from "@validators/verification/verifyForgotVerification.validator";
import { VerifyAccountVerificationContext } from "@validators/verification/verifyAccountVerification.validator";

import { setSessionCookie } from "@database/organizer/helpers/cookie";

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
        case "organizer":
          result = await createOrganizerAccountVerification(id);
          break;

        default:
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role",
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
        case "organizer":
          result = await verifyOrganizerAccountVerification(id, data);
          break;

        default:
          return ApiErrorCustomResponse(ctx, {
            error: "Invalid User Role Provided",
            code: "BAD_REQUEST",
          });
      }

      const { refreshToken, ...organizer } = result;

      if (refreshToken) {
        await setSessionCookie(ctx, refreshToken);
      }

      return ctx.json(organizer, 200);
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
