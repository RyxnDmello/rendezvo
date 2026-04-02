import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const deleteEventImageValidatorSchema = z.strictObject(
  {
    index: z
      .number("Image Index Must Be A Valid Number")
      .min(1, "Image Index Must Be A Minimum Of 1")
      .max(5, "Image Index Must Be A Maximum Of 5"),
  },
  "Only Event Event Image Index Must Be Provided",
);

/**
 * A validator middleware for event image deletion requests.
 *
 * This middleware validates the request body against the event image deletion schema.
 */
const deleteEventImageValidator = validator(
  "json",
  deleteEventImageValidatorSchema,
);

/**
 * A type that represents the validated event image deletion payload.
 */
export type DeleteEventImageValidatorSchema = z.infer<
  typeof deleteEventImageValidatorSchema
>;

/**
 * A type that represents the Hono context with validated event image deletion data.
 */
export type DeleteEventImageContext = ValidatorContext<
  typeof deleteEventImageValidator
>;

export default deleteEventImageValidator;
