import * as z from "zod";

import { ValidationTargets } from "hono";

import { zValidator } from "@hono/zod-validator";

export const validator = <
  T extends z.ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) => {
  return zValidator(target, schema, (result, ctx) => {
    if (!result.success) {
      ctx.status(400);

      const error = result.error.issues[0]?.message;

      return ctx.json({
        error: error ?? "The Server Detected A Validation Error",
      });
    }

    return ctx.json(result.data);
  });
};
