import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

export const verifyResetVerificationValidatorSchema = z.strictObject(
  {
    otp: z
      .string("OTP Must Be A 6 Digit String")
      .min(6, "OTP Must Be 6 Digits")
      .max(6, "OTP Must Be 6 Digits")
      .regex(/^\d{6}$/, "OTP Must Be 6 Digits"),
  },
  "Only OTP Must Be Provided",
);

const verifyResetVerificationValidator = validator(
  "json",
  verifyResetVerificationValidatorSchema,
);

export type VerifyResetVerificationValidatorSchema = z.infer<
  typeof verifyResetVerificationValidatorSchema
>;

export type VerifyResetVerificationContext = ValidatorContext<
  typeof verifyResetVerificationValidator
>;

export default verifyResetVerificationValidator;
