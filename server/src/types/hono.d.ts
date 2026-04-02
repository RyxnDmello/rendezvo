import "hono";

import { Role } from "@constants/user";

declare module "hono" {
  interface ContextVariableMap {
    /**
     * This variable is attached to the hono context.
     *
     * When the bearer token, from the authorization header, is
     * validated on every protected request, this variable is set.
     */
    user: {
      id: string;
      role: Role;
    };
  }
}
