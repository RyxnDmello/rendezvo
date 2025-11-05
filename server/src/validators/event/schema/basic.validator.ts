import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const eventBasicValidatorSchema = z.strictObject(
  {
    title: z
      .string("Event Title Must Be A String")
      .min(4, "Event Title Must Be A Minimum Of 4 Characters")
      .max(25, "Event Title Must Be A Maximum Of 25 Characters")
      .trim(),
    category: z
      .string("Event Category Must Be A Single Worded String")
      .lowercase("Event Category Must Be Lowercase")
      .min(4, "Event Category Must Be A Minimum Of 4 Characters")
      .max(10, "Event Category Must Be A Maximum Of 10 Characters")
      .regex(/^[A-Za-z]+$/, "Event Category Must Contain Only Letters")
      .trim(),
    description: z
      .string("Event Description Must Be A String")
      .min(10, "Event Description Must Be A Minimum Of 10 Characters")
      .max(500, "Event Description Must Be A Maximum Of 500 Characters")
      .trim(),
    tags: z
      .array(
        z
          .string("Event Tag Must Be A String")
          .lowercase("Event Tag Must Be Lowercase")
          .min(4, "Event Tag Must Be A Minimum Of 4 Characters")
          .max(10, "Event Tag Must Be A Maximum Of 10 Characters")
          .regex(/^[A-Za-z]+$/, "Event Tag Must Contain Only Letters")
          .trim(),
        "Tags Must Be A List Of Valid Tags"
      )
      .refine((tags) => {
        const unique = new Set(tags);
        return unique.size === tags.length;
      }, "Duplicate Event Tags Are Not Allowed")
      .min(1, "Event Tags Must Be A Minimum Of 1")
      .max(10, "Event Tags Must Be A Maximum Of 10")
      .optional(),
  },
  "Only Event Basic Details Must Be Provided"
);

const eventBasicValidator = validator("json", eventBasicValidatorSchema);

export type BasicValidatorSchema = z.infer<typeof eventBasicValidatorSchema>;

export type EventBasicContext = ValidatorContext<typeof eventBasicValidator>;

export default eventBasicValidator;
