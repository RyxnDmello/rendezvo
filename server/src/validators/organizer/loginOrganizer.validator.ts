import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const loginOrganizerValidatorSchema = z.strictObject(
  {
    email: z
      .email("Email Must Be A Valid Email Address")
      .min(10, "Email Must Be A Minimum Of 10 Characters")
      .max(250, "Email Must Be A Maximum Of 250 Characters")
      .lowercase("Email Must Be Lowercase")
      .trim(),
    password: z
      .string("Password Must Be A String Or Phrase")
      .min(8, "Password Must Be A Minimum Of 8 Characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/,
        "Password Must Contain At Least 1 Lowercase, 1 Uppercase, 1 Digit, And 1 Special Character",
      )
      .max(50, "Password Must Be A Maximum Of 50 Characters")
      .trim(),
  },
  "Only Email And Password Must Be Provided",
);

/**
 * A validator middleware for organizer login requests.
 *
 * This middleware validates the request body against the login schema.
 */
const loginOrganizerValidator = validator(
  "json",
  loginOrganizerValidatorSchema,
);

/**
 * A type that represents the validated login organizer payload.
 */
export type LoginOrganizerValidatorSchema = z.infer<
  typeof loginOrganizerValidatorSchema
>;

/**
 * A type that represents the Hono context with validated login organizer data.
 */
export type LoginOrganizerContext = ValidatorContext<
  typeof loginOrganizerValidator
>;

export default loginOrganizerValidator;
