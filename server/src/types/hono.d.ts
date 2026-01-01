import "hono";

type Role = "admin" | "organizer" | "attendee";

declare module "hono" {
  interface ContextVariableMap {
    user: {
      id: string;
      role: Role;
    };
  }
}
