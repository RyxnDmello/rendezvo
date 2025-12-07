import * as z from "zod";

export const ticketPricingValidatorSchema = z.strictObject(
  {
    entry: z
      .number("Ticket Entry Fee Must Be A Valid Number")
      .min(0, "Ticket Entry Fee Must Be A Minimum Of 0"),
    cover: z
      .number("Ticket Cover Charge Must Be A Valid Number")
      .min(0, "Ticket Cover Charge Must Be A Minimum Of 0"),
  },
  "Ticket Pricing Details Must Be Provided"
);

export type TicketPricingValidatorSchema = z.infer<
  typeof ticketPricingValidatorSchema
>;
