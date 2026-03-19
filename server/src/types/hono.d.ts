import "hono";

import { Role } from "@constants/user";

declare module "hono" {
  interface ContextVariableMap {
    user: {
      id: string;
      role: Role;
    };
  }
}
