import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

export const createResetVerificationValidatorSchema = z
  .strictObject(
    {
      password: z
        .string("Password Must Be A String Or Phrase")
        .min(8, "Password Must Be A Minimum Of 8 Characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/,
          "Password Must Contain At Least 1 Lowercase, 1 Uppercase, 1 Digit, And 1 Special Character",
        )
        .max(50, "Password Must Be A Maximum Of 50 Characters")
        .trim(),
      newPassword: z
        .string("Password Must Be A String Or Phrase")
        .min(8, "Password Must Be A Minimum Of 8 Characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/,
          "Password Must Contain At Least 1 Lowercase, 1 Uppercase, 1 Digit, And 1 Special Character",
        )
        .max(50, "Password Must Be A Maximum Of 50 Characters")
        .trim(),
    },
    "Only Password And New Password Must Be Provided",
  )
  .refine((data) => {
    return data.password !== data.newPassword;
  }, "New Password Must Be Different From The Current Password");

const createResetVerificationValidator = validator(
  "json",
  createResetVerificationValidatorSchema,
);

export type CreateResetVerificationValidatorSchema = z.infer<
  typeof createResetVerificationValidatorSchema
>;

export type CreateResetVerificationContext = ValidatorContext<
  typeof createResetVerificationValidator
>;

export default createResetVerificationValidator;
