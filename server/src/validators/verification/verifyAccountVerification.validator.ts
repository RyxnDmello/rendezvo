import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const verifyAccountVerificationValidatorSchema = z.strictObject(
  {
    otp: z
      .string("OTP Must Be A 6 Digit String")
      .min(6, "OTP Must Be 6 Digits")
      .max(6, "OTP Must Be 6 Digits")
      .regex(/^\d{6}$/, "OTP Must Be 6 Digits"),
  },
  "Only OTP Be Provided",
);

/**
 * A validator middleware for account verification requests.
 *
 * This middleware validates the request body against the account verification schema.
 */
const verifyAccountVerificationValidator = validator(
  "json",
  verifyAccountVerificationValidatorSchema,
);

/**
 * A type that represents the validated account verification payload.
 */
export type VerifyAccountVerificationValidatorSchema = z.infer<
  typeof verifyAccountVerificationValidatorSchema
>;

/**
 * A type that represents the Hono context with validated account verification data.
 */
export type VerifyAccountVerificationContext = ValidatorContext<
  typeof verifyAccountVerificationValidator
>;

export default verifyAccountVerificationValidator;
