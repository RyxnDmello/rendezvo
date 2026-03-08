import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

import { ticketPricingValidatorSchema } from "./schema/pricing.validator";
import { ticketQuantityValidatorSchema } from "./schema/quantity.validator";
import { ticketScheduleValidatorSchema } from "./schema/schedule.validator";

const updateTicketValidatorSchema = z
  .strictObject(
    {
      action: z.enum(
        ["basic", "pricing", "quantity", "schedule"],
        "Provide The Specific Action You Need To Perform",
      ),
      name: z
        .string("Ticket Name Must Be A Valid String")
        .min(4, "Ticket Name Must Be A Minimum Of 4 Characters")
        .max(50, "Ticket Name Must Be A Maximum Of 50 Characters")
        .regex(
          /^[A-Za-z\s]+$/,
          "Ticket Name Must Contain Only Letters And Spaces",
        )
        .optional(),
      description: z
        .string("Ticket Description Must Be A Valid String")
        .min(4, "Ticket Description Must Be A Minimum Of 4 Characters")
        .max(100, "Ticket Description Must Be A Maximum Of 100 Characters")
        .optional(),
      pricing: ticketPricingValidatorSchema.optional(),
      quantity: ticketQuantityValidatorSchema.optional(),
      schedule: ticketScheduleValidatorSchema.optional(),
    },
    "Ticket Details Must Be Provided",
  )
  .superRefine((values, ctx) => {
    const { action, ...fields } = values;

    if (action === "basic") return;

    const type = action[0]?.toUpperCase() + action.substring(1);

    if (!fields[action]) {
      return ctx.addIssue({
        code: "custom",
        message: `Event ${type} Details Must Be Provided`,
      });
    }

    const others = ["pricing", "quantity", "schedule"].filter(
      (key) => key !== action,
    );

    for (const key of others) {
      if (fields[key as keyof typeof fields] !== undefined) {
        return ctx.addIssue({
          code: "custom",
          message: `Only Event ${type} Details Must Be Provided`,
        });
      }
    }
  });

const updateTicketValidator = validator("json", updateTicketValidatorSchema);

export type UpdateTicketValidatorSchema = z.infer<
  typeof updateTicketValidatorSchema
>;

export type UpdateTicketContext = ValidatorContext<
  typeof updateTicketValidator
>;

export default updateTicketValidator;
