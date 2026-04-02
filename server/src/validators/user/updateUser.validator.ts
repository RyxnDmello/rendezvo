import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const updateUserValidatorSchema = z.strictObject(
  {
    name: z
      .string("Name Must Be A Valid First, Middle, And Last Name")
      .min(4, "Name Must Be A Minimum Of 4 Characters")
      .max(50, "Name Must Be A Maximum Of 50 Characters")
      .regex(/^[A-Za-z\s]+$/, "Name Must Contain Only Letters And Spaces")
      .trim()
      .optional(),
    mobile: z
      .number("Mobile Number Must Be A Valid 10 Digit Number")
      .positive("Mobile Number Must Be A Valid 10 Digit Number")
      .refine(
        (value) => ["6", "7", "8", "9"].includes(value.toString()[0]!),
        "Mobile Number Must Start With 6, 7, 8, Or 9",
      )
      .min(6000000000, "Mobile Number Must Be 10 Digits")
      .max(9999999999, "Mobile Number Must Be 10 Digits")
      .optional(),
  },
  "Only Name Or Mobile Number Can Be Provided",
);

/**
 * A validator middleware for user update requests.
 *
 * This middleware validates the request body against the update schema.
 */
const updateUserValidator = validator("json", updateUserValidatorSchema);

/**
 * A type that represents the validated update user payload.
 */
export type UpdateUserValidatorSchema = z.infer<
  typeof updateUserValidatorSchema
>;

/**
 * A type that represents the Hono context with validated update user data.
 */
export type UpdateUserContext = ValidatorContext<typeof updateUserValidator>;

export default updateUserValidator;
