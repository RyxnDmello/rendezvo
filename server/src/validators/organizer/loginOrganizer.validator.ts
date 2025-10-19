import * as z from "zod";

import validator from "@middlewares/validator.middleware";

export const loginOrganizerValidatorSchema = z.strictObject(
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
        "Password Must Contain At Least 1 Lowercase, 1 Uppercase, 1 Digit, And 1 Special Character"
      )
      .max(50, "Password Must Be A Maximum Of 50 Characters")
      .trim(),
  },
  "Only Email And Password Must Be Provided"
);

const loginOrganizerValidator = validator(
  "json",
  loginOrganizerValidatorSchema
);

export type LoginOrganizerValidatorSchema = z.infer<
  typeof loginOrganizerValidatorSchema
>;

export default loginOrganizerValidator;
