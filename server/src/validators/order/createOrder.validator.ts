import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const ticketSchema = z.strictObject({
  ticketID: z.string("Ticket ID Must Be A Valid ID").trim(),
  quantity: z
    .number("Ticket Quantity Must Be A Valid Number")
    .min(1, "At Least 1 Ticket Must Be Added")
    .max(10, "At Most 10 Tickets Can Be Added")
    .optional()
    .default(1),
});

const couponSchema = z.string("Coupon ID Must Be A Valid ID").trim();

const scheduleSchema = z.strictObject(
  {
    date: z
      .string("Event Date Must Be In The YYYY-MM-DD Format")
      .regex(
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        "Event Date Must Be In The YYYY-MM-DD Format",
      )
      .refine((value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date > new Date();
      }, "Event Date Must Be A Future Date")
      .trim(),
    startTime: z
      .string("Slot Start Time Must Be In The 24 Hour Format")
      .regex(
        /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
        "Slot Start Time Must Be In The 24 Hour Format",
      )
      .trim(),
    endTime: z
      .string("Slot Start Time Must Be In The 24 Hour Format")
      .regex(
        /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
        "Slot Start Time Must Be In The 24 Hour Format",
      )
      .trim(),
  },
  "Only Event Date, Start And End Time Must Be Provided",
);

const createOrderValidatorSchema = z.strictObject(
  {
    eventID: z.string("Event ID Must Be A Valid ID").trim(),
    tickets: z
      .array(ticketSchema, "Tickets Must Be A List Of Valid Event Tickets")
      .min(1, "At Least 1 Event Ticket Must Be Provided")
      .max(10, "At Most 10 Event Tickets Can Be Provided")
      .superRefine((values, ctx) => {
        const ids = values.map((value) => value.ticketID);

        if (new Set(ids).size !== ids.length) {
          return ctx.addIssue({
            code: "custom",
            message: "Duplicate Event Tickets Are Not Allowed",
          });
        }

        const total = values.reduce((acc, curr) => acc + curr.quantity, 0);

        if (total > 10) {
          return ctx.addIssue({
            code: "custom",
            message:
              "Only A Maximum Of 10 Tickets Are Allowed To Place An Order",
          });
        }
      }),
    coupons: z
      .array(couponSchema, "Coupons Must Be A List Of Valid Event Coupons")
      .min(1, "At Least 1 Event Coupon Must Be Provided")
      .max(2, "At Most 2 Event Coupons Can Be Provided")
      .refine((values) => {
        return new Set(values).size === values.length;
      }, "Duplicate Event Coupons Are Not Allowed")
      .optional(),
    schedule: scheduleSchema,
  },
  "Only Event, Ticket, And Coupon Details Must Be Provided",
);

/**
 * A validator middleware for order creation requests.
 *
 * This middleware validates the request body against the create order schema.
 */
const createOrderValidator = validator("json", createOrderValidatorSchema);

/**
 * A type that represents the validated create order payload.
 */
export type CreateOrderValidatorSchema = z.infer<
  typeof createOrderValidatorSchema
>;

/**
 * A type that represents the Hono context with validated create order data.
 */
export type CreateOrderContext = ValidatorContext<typeof createOrderValidator>;

export default createOrderValidator;
