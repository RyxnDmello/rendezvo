import { ZodContext } from "hono";

import createAuthVerification from "@database/verification/createAuthVerification";
import createResetVerification from "@database/verification/createResetVerification";
import createForgotVerification from "@database/verification/createForgotVerification";

import verifyAuthVerification from "@database/verification/verifyAuthVerification";
import verifyResetVerification from "@database/verification/verifyResetVerification";
import verifyForgotVerification from "@database/verification/verifyForgotVerification";

import { CreateAuthVerificationValidatorSchema } from "@validators/verification/createAuthVerification.validator";
import { CreateResetVerificationValidatorSchema } from "@validators/verification/createResetVerification.validator";
import { CreateForgotVerificationValidatorSchema } from "@validators/verification/createForgotVerification.validator";

import { VerifyAuthVerificationValidatorSchema } from "@validators/verification/verifyAuthVerification.validator";
import { VerifyResetVerificationValidatorSchema } from "@validators/verification/verifyResetVerification.validator";
import { VerifyForgotVerificationValidatorSchema } from "@validators/verification/verifyForgotVerification.validator";

import { ApiErrorResponse } from "@utils/ApiError";

export const _createAuthVerification = async (
  ctx: ZodContext<CreateAuthVerificationValidatorSchema>
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
  ctx: ZodContext<CreateResetVerificationValidatorSchema>
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
  ctx: ZodContext<CreateForgotVerificationValidatorSchema>
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
  ctx: ZodContext<VerifyAuthVerificationValidatorSchema>
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
  ctx: ZodContext<VerifyResetVerificationValidatorSchema>
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
  ctx: ZodContext<VerifyForgotVerificationValidatorSchema>
) => {
  const data = ctx.req.valid("json");

  try {
    const result = await verifyForgotVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
