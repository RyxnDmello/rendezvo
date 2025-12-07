import * as z from "zod";

export const ticketQuantityValidatorSchema = z.strictObject(
  {
    total: z
      .number("Ticket Quantity Must Be A Valid Number")
      .min(1, "Ticket Quantity Must Be A Minimum Of 1")
      .max(500, "Ticket Quantity Must Be A Maximum Of 500"),
  },
  "Ticket Quantity Details Must Be Provided"
);

export type TicketQuantityValidatorSchema = z.infer<
  typeof ticketQuantityValidatorSchema
>;
