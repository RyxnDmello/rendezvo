import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const eventAddressValidatorSchema = z.strictObject(
  {
    url: z.url("Address URL Must Be A Valid URL").trim().optional().optional(),
    firstLine: z
      .string("Address First Line Must Be A Valid String")
      .min(4, "Address First Line Must Be A Minimum Of 4 Characters")
      .max(50, "Address First Line Must Be A Maximum Of 50 Characters"),
    secondLine: z
      .string("Address Second Line Must Be A Valid String")
      .min(4, "Address Second Line Must Be A Minimum Of 4 Characters")
      .max(50, "Address Second Line Must Be A Maximum Of 50 Characters")
      .optional(),
    country: z
      .string("Country Must Be A Valid String")
      .min(2, "Country Must Be A Minimum Of 2 Characters")
      .max(25, "Country Must Be A Maximum Of 25 Characters"),
    state: z
      .string("State Must Be A Valid String")
      .min(2, "State Must Be A Minimum Of 2 Characters")
      .max(25, "State Must Be A Maximum Of 25 Characters"),
    city: z
      .string("City Must Be A Valid String")
      .min(2, "City Must Be A Minimum Of 2 Characters")
      .max(25, "City Must Be A Maximum Of 25 Characters"),
    zip: z
      .string("Zip Code Must Be 6 Digits")
      .min(6, "Zip Code Must Be 6 Digits")
      .max(6, "Zip Code Must Be 6 Digits")
      .regex(/^\d{6}$/, "Zip Code Must Contain 6 Digits"),
  },
  "Only Event Address Details Must Be Provided"
);

const eventAddressValidator = validator("json", eventAddressValidatorSchema);

export type EventAddressValidatorSchema = z.infer<
  typeof eventAddressValidatorSchema
>;

export type EventAddressContext = ValidatorContext<
  typeof eventAddressValidator
>;

export default eventAddressValidator;
