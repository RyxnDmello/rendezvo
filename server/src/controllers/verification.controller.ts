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

export const _createAuthVerification = async (ctx: any) => {
  const { email } = ctx.req.valid(
    "json"
  ) as CreateAuthVerificationValidatorSchema;

  try {
    const result = await createAuthVerification(email);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _createResetVerification = async (ctx: any) => {
  const data = ctx.req.valid("json") as CreateResetVerificationValidatorSchema;

  try {
    const result = await createResetVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _createForgotVerification = async (ctx: any) => {
  const { email } = ctx.req.valid(
    "json"
  ) as CreateForgotVerificationValidatorSchema;

  try {
    const result = await createForgotVerification(email);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyAuthVerification = async (ctx: any) => {
  const data = ctx.req.valid("json") as VerifyAuthVerificationValidatorSchema;

  try {
    const result = await verifyAuthVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyResetVerification = async (ctx: any) => {
  const data = ctx.req.valid("json") as VerifyResetVerificationValidatorSchema;

  try {
    const result = await verifyResetVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};

export const _verifyForgotVerification = async (ctx: any) => {
  const data = ctx.req.valid("json") as VerifyForgotVerificationValidatorSchema;

  try {
    const result = await verifyForgotVerification(data);
    return ctx.json(result, 200);
  } catch (error) {
    return ApiErrorResponse(ctx, error);
  }
};
