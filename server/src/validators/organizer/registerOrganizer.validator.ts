import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

export const registerOrganizerValidatorSchema = z.strictObject(
  {
    name: z
      .string("Name Must Be A Valid First, Middle, And Last Name")
      .min(4, "Name Must Be A Minimum Of 4 Characters")
      .max(50, "Name Must Be A Maximum Of 50 Characters")
      .regex(/^[A-Za-z\s]+$/, "Name Must Contain Only Letters And Spaces")
      .trim(),
    email: z
      .email("Email Must Be A Valid Email Address")
      .min(10, "Email Must Be A Minimum Of 10 Characters")
      .max(250, "Email Must Be A Maximum Of 250 Characters")
      .lowercase("Email Must Be Lowercase")
      .trim(),
    mobile: z
      .number("Mobile Number Must Be A Valid 10 Digit Number")
      .positive("Mobile Number Must Be A Valid 10 Digit Number")
      .refine(
        (value) => ["6", "7", "8", "9"].includes(value.toString()[0]!),
        "Mobile Number Must Start With 6, 7, 8, Or 9",
      )
      .min(6000000000, "Mobile Number Must Be 10 Digits")
      .max(9999999999, "Mobile Number Must Be 10 Digits"),
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
  "Only Name, Email, Mobile, And Password Must Be Provided",
);

const registerOrganizerValidator = validator(
  "json",
  registerOrganizerValidatorSchema,
);

export type RegisterOrganizerValidatorSchema = z.infer<
  typeof registerOrganizerValidatorSchema
>;

export type RegisterOrganizerContext = ValidatorContext<
  typeof registerOrganizerValidator
>;

export default registerOrganizerValidator;
