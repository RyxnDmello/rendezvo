import * as z from "zod";

import validator from "@middlewares/validator.middleware";

export const createAuthVerificationValidatorSchema = z.strictObject(
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

const createAuthVerificationValidator = validator(
  "json",
  createAuthVerificationValidatorSchema
);

export type CreateAuthVerificationValidatorSchema = z.infer<
  typeof createAuthVerificationValidatorSchema
>;

export default createAuthVerificationValidator;
