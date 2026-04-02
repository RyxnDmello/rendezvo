import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const deleteEventVideoValidatorSchema = z.strictObject(
  {
    index: z
      .number("Video Index Must Be A Valid Number")
      .min(1, "Video Index Must Be A Minimum Of 1")
      .max(5, "Video Index Must Be A Maximum Of 5"),
  },
  "Only Event Event Video Index Must Be Provided",
);

/**
 * A validator middleware for event video deletion requests.
 *
 * This middleware validates the request body against the event video deletion schema.
 */
const deleteEventVideoValidator = validator(
  "json",
  deleteEventVideoValidatorSchema,
);

/**
 * A type that represents the validated event video deletion payload.
 */
export type DeleteEventVideoValidatorSchema = z.infer<
  typeof deleteEventVideoValidatorSchema
>;

/**
 * A type that represents the Hono context with validated event video deletion data.
 */
export type DeleteEventVideoContext = ValidatorContext<
  typeof deleteEventVideoValidator
>;

export default deleteEventVideoValidator;
