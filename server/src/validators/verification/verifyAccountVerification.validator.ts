import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

export const verifyAccountVerificationValidatorSchema = z.strictObject(
  {
    otp: z
      .string("OTP Must Be A 6 Digit String")
      .min(6, "OTP Must Be 6 Digits")
      .max(6, "OTP Must Be 6 Digits")
      .regex(/^\d{6}$/, "OTP Must Be 6 Digits"),
  },
  "Only OTP Be Provided",
);

const verifyAccountVerificationValidator = validator(
  "json",
  verifyAccountVerificationValidatorSchema,
);

export type VerifyAccountVerificationValidatorSchema = z.infer<
  typeof verifyAccountVerificationValidatorSchema
>;

export type VerifyAccountVerificationContext = ValidatorContext<
  typeof verifyAccountVerificationValidator
>;

export default verifyAccountVerificationValidator;
