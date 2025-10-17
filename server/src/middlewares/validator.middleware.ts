import * as z from "zod";

import { Context, Next, ValidationTargets } from "hono";

import { zValidator } from "@hono/zod-validator";

import { ApiErrorCustomResponse } from "@utils/ApiError";

type Targets = keyof ValidationTargets;

const validator = <Target extends Targets, Schema extends z.ZodType>(
  target: Target,
  schema: Schema
) => {
  if (target === "form") {
    return async (ctx: Context, next: Next) => {
      const { data, ...files } = await ctx.req.parseBody();

      const body = JSON.parse(data as string);

      const result = schema.safeParse(body);

      if (result.success) {
        ctx.set("data", result.data);

        Object.entries(files).forEach(([key, value]) => {
          ctx.set(key, value);
        });

        return await next();
      }

      const message = result.error.issues[0]?.message;

      return ApiErrorCustomResponse(ctx, {
        error: message ?? "Unable To Proceed Due To A Validation Error",
        code: "VALIDATION_ERROR",
      });
    };
  }

  return zValidator(target, schema, (result, ctx) => {
    if (result.success) return;

    const message = result.error.issues[0]?.message;

    return ApiErrorCustomResponse(ctx, {
      error: message ?? "Unable To Proceed Due To A Validation Error",
      code: "VALIDATION_ERROR",
    });
  });
};

export default validator;
