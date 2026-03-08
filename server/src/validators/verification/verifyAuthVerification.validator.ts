import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

export const verifyAuthVerificationValidatorSchema = z.strictObject(
  {
    otp: z
      .string("OTP Must Be A 6 Digit String")
      .min(6, "OTP Must Be 6 Digits")
      .max(6, "OTP Must Be 6 Digits")
      .regex(/^\d{6}$/, "OTP Must Be 6 Digits"),
  },
  "Only OTP Be Provided",
);

const verifyAuthVerificationValidator = validator(
  "json",
  verifyAuthVerificationValidatorSchema,
);

export type VerifyAuthVerificationValidatorSchema = z.infer<
  typeof verifyAuthVerificationValidatorSchema
>;

export type VerifyAuthVerificationContext = ValidatorContext<
  typeof verifyAuthVerificationValidator
>;

export default verifyAuthVerificationValidator;
