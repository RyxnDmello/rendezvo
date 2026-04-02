import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const verifyResetVerificationValidatorSchema = z
  .strictObject(
    {
      otp: z
        .string("OTP Must Be A 6 Digit String")
        .min(6, "OTP Must Be 6 Digits")
        .max(6, "OTP Must Be 6 Digits")
        .regex(/^\d{6}$/, "OTP Must Be 6 Digits"),
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
    "Only OTP Must Be Provided",
  )
  .refine((data) => {
    return data.password !== data.newPassword;
  }, "Password And New Password Must Be Different");

/**
 * A validator middleware for password reset verification requests.
 *
 * This middleware validates the request body against the password reset verification schema.
 */
const verifyResetVerificationValidator = validator(
  "json",
  verifyResetVerificationValidatorSchema,
);

/**
 * A type that represents the validated password reset verification payload.
 */
export type VerifyResetVerificationValidatorSchema = z.infer<
  typeof verifyResetVerificationValidatorSchema
>;

/**
 * A type that represents the Hono context with validated password reset verification data.
 */
export type VerifyResetVerificationContext = ValidatorContext<
  typeof verifyResetVerificationValidator
>;

export default verifyResetVerificationValidator;
