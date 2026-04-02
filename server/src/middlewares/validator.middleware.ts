import * as z from "zod";

import { Context, Env, MiddlewareHandler, ValidationTargets } from "hono";

import { zValidator } from "@hono/zod-validator";

import ApiError from "@utils/ApiError";

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

/**
 * A type that resolves Zod validators into a compatible Hono context.
 *
 * The ValidatorContext takes a zod validator as its generic type and
 * resolves a context type that is compatible with Hono.
 *
 * @example
 * import * as z from "zod";
 *
 * const someValidatorSchema = z.strictObject({});
 *
 * const someValidator = validator("body", someValidatorSchema);
 *
 * const SchemaContext = ValidatorContext<typeof someValidator>;
 */
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

/**
 * A middleware that validates hono requests such as the request
 * header, params, queries, body, form, or cookies.
 *
 * @param {Target} t - The target where zod needs to validate.
 * @param {z.ZodType} s - The zod validator schema to be be used.
 *
 * @returns The context with proper type support based on the zod validator schema.
 *
 * @example
 * import * as z from "zod";
 *
 * const someValidatorSchema = z.strictObject({});
 *
 * const someValidator = validator("body", someValidatorSchema);
 */
const validator = <T extends Target, S extends z.ZodType>(t: T, s: S) => {
  const handler = zValidator(t, s, (result, _) => {
    if (result.success) return;

    const message = result.error.issues[0]?.message;

    throw new ApiError(
      message ?? "Unable To Proceed Due To A Validation Error",
      "VALIDATION_ERROR",
    );
  });

  return handler as ValidatorMiddleware<T, S>;
};

export default validator;
