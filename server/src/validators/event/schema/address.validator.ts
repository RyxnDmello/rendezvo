import * as z from "zod";

export const eventAddressValidatorSchema = z.strictObject(
  {
    url: z.url("Address URL Must Be A Valid URL").trim().optional(),
    firstLine: z
      .string("Address First Line Must Be A Valid String")
      .min(4, "Address First Line Must Be A Minimum Of 4 Characters")
      .max(50, "Address First Line Must Be A Maximum Of 50 Characters")
      .trim(),
    secondLine: z
      .string("Address Second Line Must Be A Valid String")
      .min(4, "Address Second Line Must Be A Minimum Of 4 Characters")
      .max(50, "Address Second Line Must Be A Maximum Of 50 Characters")
      .trim()
      .optional(),
    country: z
      .string("Country Must Be A Valid String")
      .min(2, "Country Must Be A Minimum Of 2 Characters")
      .max(25, "Country Must Be A Maximum Of 25 Characters")
      .trim(),
    state: z
      .string("State Must Be A Valid String")
      .min(2, "State Must Be A Minimum Of 2 Characters")
      .max(25, "State Must Be A Maximum Of 25 Characters")
      .trim(),
    city: z
      .string("City Must Be A Valid String")
      .min(2, "City Must Be A Minimum Of 2 Characters")
      .max(25, "City Must Be A Maximum Of 25 Characters")
      .trim(),
    zip: z
      .string("Zip Code Must Be 6 Digits")
      .min(6, "Zip Code Must Be 6 Digits")
      .max(6, "Zip Code Must Be 6 Digits")
      .regex(/^\d{6}$/, "Zip Code Must Contain 6 Digits"),
  },
  "Only Event Address Details Must Be Provided"
);

export type EventAddressValidatorSchema = z.infer<
  typeof eventAddressValidatorSchema
>;
