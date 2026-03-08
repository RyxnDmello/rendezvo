import { Context } from "hono";

import createAuthVerification from "@database/verification/createAuthVerification";
import createResetVerification from "@database/verification/createResetVerification";
import createForgotVerification from "@database/verification/createForgotVerification";

import verifyAuthVerification from "@database/verification/verifyAuthVerification";
import verifyResetVerification from "@database/verification/verifyResetVerification";
import verifyForgotVerification from "@database/verification/verifyForgotVerification";

import { CreateResetVerificationContext } from "@validators/verification/createResetVerification.validator";

import { VerifyAuthVerificationContext } from "@validators/verification/verifyAuthVerification.validator";
import { VerifyResetVerificationContext } from "@validators/verification/verifyResetVerification.validator";
import { VerifyForgotVerificationContext } from "@validators/verification/verifyForgotVerification.validator";

import { setSessionCookie } from "@database/organizer/helpers/cookie";

import { ApiErrorResponse, ApiErrorCustomResponse } from "@utils/ApiError";

export const _createAuthVerification = async (ctx: Context) => {
  const id = ctx.req.param("id");

  if (!id) {
    return ApiErrorCustomResponse(ctx, {
      error: "User ID Must Be Provided",
      code: "BAD_REQUEST",
    });
  }

  try {
    const result = await createAuthVerification(id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _createForgotVerification = async (ctx: Context) => {
  const id = ctx.req.param("id");

  if (!id) {
    return ApiErrorCustomResponse(ctx, {
      error: "User ID Must Be Provided",
      code: "BAD_REQUEST",
    });
  }

  try {
    const result = await createForgotVerification(id);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _createResetVerification = async (
  ctx: CreateResetVerificationContext,
) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  try {
    const result = await createResetVerification(user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyAuthVerification = async (
  ctx: VerifyAuthVerificationContext,
) => {
  const id = ctx.req.param("id");

  if (!id) {
    return ApiErrorCustomResponse(ctx, {
      error: "User ID Must Be Provided",
      code: "BAD_REQUEST",
    });
  }

  const data = ctx.req.valid("json");

  try {
    const { refreshToken, ...organizer } = await verifyAuthVerification(
      id,
      data,
    );

    if (refreshToken) {
      await setSessionCookie(ctx, refreshToken);
    }

    return ctx.json(organizer, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyForgotVerification = async (
  ctx: VerifyForgotVerificationContext,
) => {
  const id = ctx.req.param("id");

  if (!id) {
    return ApiErrorCustomResponse(ctx, {
      error: "User ID Must Be Provided",
      code: "BAD_REQUEST",
    });
  }

  const data = ctx.req.valid("json");

  try {
    const result = await verifyForgotVerification(id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyResetVerification = async (
  ctx: VerifyResetVerificationContext,
) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  try {
    const result = await verifyResetVerification(user.id, data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
