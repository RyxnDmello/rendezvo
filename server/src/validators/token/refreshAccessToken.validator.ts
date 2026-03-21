import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

import { Role } from "@constants/user";

const roles: Role[] = ["user", "admin", "organizer"];

export const refreshAccessTokenValidatorSchema = z.strictObject(
  {
    role: z.enum(roles, "Invalid Role Provided"),
  },
  "User Role Must Be Provided",
);

const refreshAccessTokenValidator = validator(
  "query",
  refreshAccessTokenValidatorSchema,
);

export type RefreshAccessTokenValidatorSchema = z.infer<
  typeof refreshAccessTokenValidatorSchema
>;

export type RefreshAccessTokenContext = ValidatorContext<
  typeof refreshAccessTokenValidator
>;

export default refreshAccessTokenValidator;
