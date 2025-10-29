import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

export const createForgotVerificationValidatorSchema = z.strictObject(
  {
    email: z
      .email("Email Must Be A Valid Email Address")
      .min(10, "Email Must Be A Minimum Of 10 Characters")
      .max(250, "Email Must Be A Maximum Of 250 Characters")
      .lowercase("Email Must Be Lowercase")
      .trim(),
  },
  "Only Email Must Be Provided"
);

const createForgotVerificationValidator = validator(
  "json",
  createForgotVerificationValidatorSchema
);

export type CreateForgotVerificationValidatorSchema = z.infer<
  typeof createForgotVerificationValidatorSchema
>;

export type CreateForgotVerificationContext = ValidatorContext<
  typeof createForgotVerificationValidator
>;

export default createForgotVerificationValidator;
