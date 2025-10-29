import createAuthVerification from "@database/verification/createAuthVerification";
import createResetVerification from "@database/verification/createResetVerification";
import createForgotVerification from "@database/verification/createForgotVerification";

import verifyAuthVerification from "@database/verification/verifyAuthVerification";
import verifyResetVerification from "@database/verification/verifyResetVerification";
import verifyForgotVerification from "@database/verification/verifyForgotVerification";

import { CreateAuthVerificationContext } from "@validators/verification/createAuthVerification.validator";
import { CreateResetVerificationContext } from "@validators/verification/createResetVerification.validator";
import { CreateForgotVerificationContext } from "@validators/verification/createForgotVerification.validator";

import { VerifyAuthVerificationContext } from "@validators/verification/verifyAuthVerification.validator";
import { VerifyResetVerificationContext } from "@validators/verification/verifyResetVerification.validator";
import { VerifyForgotVerificationContext } from "@validators/verification/verifyForgotVerification.validator";

import { ApiErrorResponse } from "@utils/ApiError";

export const _createAuthVerification = async (
  ctx: CreateAuthVerificationContext
) => {
  const { email } = ctx.req.valid("json");

  try {
    const result = await createAuthVerification(email);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _createResetVerification = async (
  ctx: CreateResetVerificationContext
) => {
  const data = ctx.req.valid("json");

  try {
    const result = await createResetVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _createForgotVerification = async (
  ctx: CreateForgotVerificationContext
) => {
  const { email } = ctx.req.valid("json");

  try {
    const result = await createForgotVerification(email);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyAuthVerification = async (
  ctx: VerifyAuthVerificationContext
) => {
  const data = ctx.req.valid("json");

  try {
    const result = await verifyAuthVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyResetVerification = async (
  ctx: VerifyResetVerificationContext
) => {
  const data = ctx.req.valid("json");

  try {
    const result = await verifyResetVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyForgotVerification = async (
  ctx: VerifyForgotVerificationContext
) => {
  const data = ctx.req.valid("json");

  try {
    const result = await verifyForgotVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
