import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

export const verifyResetVerificationValidatorSchema = z.strictObject(
  {
    otp: z
      .string("OTP Must Be A 6 Digit String")
      .min(6, "OTP Must Be 6 Digits")
      .max(6, "OTP Must Be 6 Digits")
      .regex(/^\d{6}$/, "OTP Must Be 6 Digits"),
    email: z
      .email("Email Must Be A Valid Email Address")
      .min(10, "Email Must Be A Minimum Of 10 Characters")
      .max(250, "Email Must Be A Maximum Of 250 Characters")
      .lowercase("Email Must Be Lowercase")
      .trim(),
  },
  "Only OTP And Email Must Be Provided"
);

const verifyResetVerificationValidator = validator(
  "json",
  verifyResetVerificationValidatorSchema
);

export type VerifyResetVerificationContext = ValidatorContext<
  typeof verifyResetVerificationValidator
>;

export default verifyResetVerificationValidator;
