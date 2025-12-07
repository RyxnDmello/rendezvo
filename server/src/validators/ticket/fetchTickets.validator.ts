import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const fetchTicketsValidatorSchema = z.strictObject(
  {
    ownerID: z
      .string("Owner ID Must Be Provided")
      .trim()
      .nonempty("Owner ID Must Be Provided")
      .nonoptional("Owner ID Must Be Provided"),
  },
  "Only Event Owner ID Must Be Provided"
);

const fetchTicketsValidator = validator("query", fetchTicketsValidatorSchema);

export type FetchTicketsValidatorSchema = z.infer<
  typeof fetchTicketsValidatorSchema
>;

export type FetchTicketsContext = ValidatorContext<
  typeof fetchTicketsValidator
>;

export default fetchTicketsValidator;
