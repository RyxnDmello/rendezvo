import * as z from "zod";

const termsSchema = z.strictObject(
  {
    title: z
      .string("Terms & Conditions Title Must Be A String")
      .min(4, "Terms Title Must Be A Minimum Of 4 Characters")
      .max(50, "Terms Title Must Be A Maximum Of 50 Characters")
      .trim(),
    description: z
      .string("Terms & Conditions Description Must Be A String")
      .min(4, "Terms Description Must Be A Minimum Of 4 Characters")
      .max(500, "Terms Description Must Be A Maximum Of 500 Characters")
      .trim(),
  },
  "Event Terms & Condition Policy Details Must Be Provided",
);

const refundSchema = z.strictObject(
  {
    title: z
      .string("Refund Policy Title Must Be A String")
      .min(4, "Refund Title Must Be A Minimum Of 4 Characters")
      .max(50, "Refund Title Must Be A Maximum Of 50 Characters")
      .trim(),
    duration: z
      .number("Refund Duration Must Be A Number")
      .min(7, "Refund Duration Must Be A Minimum Of 7 Days")
      .max(14, "Refund Duration Must Be A Maximum Of 14 Days")
      .default(7),
    description: z
      .string("Refund Policy Description Must Be A String")
      .min(4, "Refund Description Must Be A Minimum Of 4 Characters")
      .max(250, "Refund Description Must Be A Maximum Of 250 Characters")
      .trim(),
  },
  "Event Refund Policy Details Must Be Provided",
);

export const eventPolicyValidatorSchema = z.strictObject(
  {
    terms: termsSchema,
    refund: refundSchema,
  },
  "Event Policy Details Must Be Provided",
);

export type EventPolicyValidatorSchema = z.infer<
  typeof eventPolicyValidatorSchema
>;
