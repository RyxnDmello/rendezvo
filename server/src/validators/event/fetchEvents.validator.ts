import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const fetchEventsValidatorSchema = z.strictObject(
  {
    mode: z.string("Mode Must Be A Valid Event Mode").trim().optional(),
    status: z.string("Status Must Be A Valid Event Status").trim().optional(),
    visibility: z
      .string("Visibility Must Be A Valid Event Visibility")
      .trim()
      .optional(),
    attendance: z
      .string("Attendance Must Be A Valid Event Attendance")
      .trim()
      .optional(),
    approved: z
      .enum(["true", "false"], "Approval Must Be A Valid Approval")
      .transform((value) => {
        if (!value) return;
        return value === "true";
      })
      .optional(),
    name: z.string("Name Must Be A Valid Event Name").trim().optional(),
  },
  "Invalid Query Params Provided",
);

/**
 * A validator middleware for event retrieval requests.
 *
 * This middleware validates the request query against the event retrieval schema.
 */
const fetchEventsValidator = validator("query", fetchEventsValidatorSchema);

/**
 * A type that represents the validated event retrieval payload.
 */
export type FetchEventsValidatorSchema = z.infer<
  typeof fetchEventsValidatorSchema
>;

/**
 * A type that represents the Hono context with validated event retrieval data.
 */
export type FetchEventsContext = ValidatorContext<typeof fetchEventsValidator>;

export default fetchEventsValidator;
