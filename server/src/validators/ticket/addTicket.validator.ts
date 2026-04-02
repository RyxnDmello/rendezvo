import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

import { ticketPricingValidatorSchema } from "./schema/pricing.validator";
import { ticketQuantityValidatorSchema } from "./schema/quantity.validator";
import { ticketScheduleValidatorSchema } from "./schema/schedule.validator";

const addTicketValidatorSchema = z
  .strictObject(
    {
      type: z.enum(["free", "paid"], "Invalid Ticket Type").default("paid"),
      active: z
        .boolean("Ticket Must Be Either Active Or Inactive")
        .default(true),
      name: z
        .string("Ticket Name Must Be A Valid String")
        .min(4, "Ticket Name Must Be A Minimum Of 4 Characters")
        .max(50, "Ticket Name Must Be A Maximum Of 50 Characters")
        .regex(
          /^[A-Za-z\s]+$/,
          "Ticket Name Must Contain Only Letters And Spaces",
        ),
      description: z
        .string("Ticket Description Must Be A Valid String")
        .min(4, "Ticket Description Must Be A Minimum Of 4 Characters")
        .max(100, "Ticket Description Must Be A Maximum Of 100 Characters"),
      pricing: ticketPricingValidatorSchema,
      quantity: ticketQuantityValidatorSchema,
      schedule: ticketScheduleValidatorSchema,
    },
    "Ticket Details Must Be Provided",
  )
  .superRefine((values, ctx) => {
    const { type, pricing } = values;

    const { entry, cover } = pricing;

    if (type === "paid") {
      if (entry === 0) {
        return ctx.addIssue({
          code: "custom",
          message: "A Paid Ticket Must Have An Entry Fee",
        });
      }

      if (cover !== 0 && entry > cover) {
        return ctx.addIssue({
          code: "custom",
          message: "Ticket Entry Fee Cannot Be Greater Than The Cover Charge",
        });
      }

      return;
    }

    if (entry !== 0) {
      return ctx.addIssue({
        code: "custom",
        message: "A Free Ticket Cannot Have An Entry Fee",
      });
    }
  });

/**
 * A validator middleware for add ticket requests.
 *
 * This middleware validates the request body against the add ticket schema.
 */
const addTicketValidator = validator("json", addTicketValidatorSchema);

/**
 * A type that represents the validated add ticket payload.
 */
export type AddTicketValidatorSchema = z.infer<typeof addTicketValidatorSchema>;

/**
 * A type that represents the Hono context with validated add ticket data.
 */
export type AddTicketContext = ValidatorContext<typeof addTicketValidator>;

export default addTicketValidator;
