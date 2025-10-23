import type { Context, ValidationTargets } from "hono";

import type { z } from "zod";

type Targets = keyof ValidationTargets;

declare module "hono" {
  export type ZodContext<Schema extends Type | undefined = undefined> = Context & {
    req: {
      valid: (type: Targets) => Schema;
    };
  };
}
