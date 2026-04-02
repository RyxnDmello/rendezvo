import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

import { eventRsvpValidatorSchema } from "./schema/rsvp.validator";
import { eventBasicValidatorSchema } from "./schema/basic.validator";
import { eventPolicyValidatorSchema } from "./schema/policy.validator";
import { eventAddressValidatorSchema } from "./schema/address.validator";
import { eventScheduleValidatorSchema } from "./schema/schedule.validator";
import { eventSecurityValidatorSchema } from "./schema/security.validator";

const createEventValidatorSchema = z
  .strictObject(
    {
      mode: z.enum(["online", "offline"], "Invalid Event Mode"),
      attendance: z.enum(["open", "rsvp"], "Invalid Event Attendance"),
      visibility: z.enum(["public", "private"], "Invalid Event Visibility"),
      basic: eventBasicValidatorSchema,
      policy: eventPolicyValidatorSchema,
      address: eventAddressValidatorSchema,
      schedule: eventScheduleValidatorSchema,
      rsvp: eventRsvpValidatorSchema.optional(),
      security: eventSecurityValidatorSchema.optional(),
    },
    "Event Details Must Be Provided",
  )
  .superRefine((values, ctx) => {
    const { attendance, visibility, rsvp, security } = values;

    if (attendance === "open" && rsvp) {
      return ctx.addIssue({
        code: "custom",
        message: "RSVP Details Are Not Allowed For Open Attendance Events",
      });
    }

    if (attendance === "rsvp" && !rsvp) {
      return ctx.addIssue({
        code: "custom",
        message: "RSVP Details Must Be Provided For RSVP Attendance Events",
      });
    }

    if (visibility === "public" && security) {
      return ctx.addIssue({
        code: "custom",
        message: "Access Codes Are Not Allowed For Public Visibility Events",
      });
    }

    if (visibility === "private" && !security) {
      return ctx.addIssue({
        code: "custom",
        message: "Access Codes Must Be Provided For Private Visibility Events",
      });
    }
  });

/**
 * A validator middleware for event creation requests.
 *
 * This middleware validates the request body against the create event schema.
 */
const createEventValidator = validator("json", createEventValidatorSchema);

/**
 * A type that represents the validated create event payload.
 */
export type CreateEventValidatorSchema = z.infer<
  typeof createEventValidatorSchema
>;

/**
 * A type that represents the Hono context with validated create event data.
 */
export type CreateEventContext = ValidatorContext<typeof createEventValidator>;

export default createEventValidator;
