import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const deleteEventVideoValidatorSchema = z.strictObject(
  {
    index: z
      .number("Video Index Must Be A Valid Number")
      .min(1, "Video Index Must Be A Minimum Of 1")
      .max(5, "Video Index Must Be A Maximum Of 5"),
  },
  "Only Event Event Video Index Must Be Provided"
);

const deleteEventVideoValidator = validator(
  "json",
  deleteEventVideoValidatorSchema
);

export type DeleteEventVideoValidatorSchema = z.infer<
  typeof deleteEventVideoValidatorSchema
>;

export type DeleteEventVideoContext = ValidatorContext<
  typeof deleteEventVideoValidator
>;

export default deleteEventVideoValidator;
