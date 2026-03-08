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

const deleteEventImageValidator = validator(
  "json",
  deleteEventImageValidatorSchema,
);

export type DeleteEventImageValidatorSchema = z.infer<
  typeof deleteEventImageValidatorSchema
>;

export type DeleteEventImageContext = ValidatorContext<
  typeof deleteEventImageValidator
>;

export default deleteEventImageValidator;
