import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

import { eventRsvpValidatorSchema } from "@validators/event/schema/rsvp.validator";
import { eventBasicValidatorSchema } from "@validators/event/schema/basic.validator";
import { eventPolicyValidatorSchema } from "@validators/event/schema/policy.validator";
import { eventAddressValidatorSchema } from "@validators/event/schema/address.validator";
import { eventScheduleValidatorSchema } from "@validators/event/schema/schedule.validator";
import { eventSecurityValidatorSchema } from "@validators/event/schema/security.validator";

const updateEventValidatorSchema = z
  .strictObject(
    {
      action: z.enum(
        ["basic", "address", "schedule", "policy", "rsvp", "security"],
        "Provide The Specific Action You Need To Perform",
      ),
      rsvp: eventRsvpValidatorSchema.optional(),
      basic: eventBasicValidatorSchema.optional(),
      policy: eventPolicyValidatorSchema.optional(),
      address: eventAddressValidatorSchema.optional(),
      schedule: eventScheduleValidatorSchema.optional(),
      security: eventSecurityValidatorSchema.optional(),
    },
    "Only The Action And Event Details Must Be Provided",
  )
  .superRefine((values, ctx) => {
    const { action, ...fields } = values;

    const type = action[0]?.toUpperCase() + action.substring(1);

    if (!fields[action]) {
      return ctx.addIssue({
        code: "custom",
        message: `Event ${type} Details Must Be Provided`,
      });
    }

    const others = [
      "rsvp",
      "basic",
      "policy",
      "address",
      "schedule",
      "security",
    ].filter((key) => key !== action);

    for (const key of others) {
      if (fields[key as keyof typeof fields] !== undefined) {
        return ctx.addIssue({
          code: "custom",
          message: `Only Event ${type} Details Must Be Provided`,
        });
      }
    }
  });

const updateEventValidator = validator("json", updateEventValidatorSchema);

export type UpdateEventValidatorSchema = z.infer<
  typeof updateEventValidatorSchema
>;

export type UpdateEventContext = ValidatorContext<typeof updateEventValidator>;

export default updateEventValidator;
