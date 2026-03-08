import * as z from "zod";

import { Context, Env, MiddlewareHandler, ValidationTargets } from "hono";

import { zValidator } from "@hono/zod-validator";

import { ApiErrorCustomResponse } from "@utils/ApiError";

type Target = keyof ValidationTargets;

type ValidatorMiddleware<
  T extends Target,
  S extends z.ZodType,
> = MiddlewareHandler<
  Env,
  string,
  {
    in: Record<T, z.input<S>>;
    out: Record<T, z.output<S>>;
  }
>;

export type ValidatorContext<T> = T extends (
  ...args: any[]
) => Promise<any> | void
  ? Parameters<T>[0] extends Context
    ? Parameters<T>[0]
    : never
  : T extends (arg: infer First, ...rest: any) => any
    ? First extends Context
      ? First
      : never
    : T extends { (...args: infer P): any }
      ? P[0] extends Context
        ? P[0]
        : never
      : never;

const validator = <T extends Target, S extends z.ZodType>(t: T, s: S) => {
  const handler = zValidator(t, s, (result, ctx) => {
    if (result.success) return;

    const message = result.error.issues[0]?.message;

    return ApiErrorCustomResponse(ctx, {
      error: message ?? "Unable To Proceed Due To A Validation Error",
      code: "VALIDATION_ERROR",
    });
  });

  return handler as ValidatorMiddleware<T, S>;
};

export default validator;
