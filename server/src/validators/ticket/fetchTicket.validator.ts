import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const fetchTicketValidatorSchema = z.strictObject(
  {
    ownerID: z
      .string("Owner ID Must Be Provided")
      .trim()
      .nonempty("Owner ID Must Be Provided")
      .nonoptional("Owner ID Must Be Provided"),
  },
  "Only Event Owner ID Must Be Provided"
);

const fetchTicketValidator = validator("query", fetchTicketValidatorSchema);

export type FetchTicketValidatorSchema = z.infer<
  typeof fetchTicketValidatorSchema
>;

export type FetchTicketContext = ValidatorContext<typeof fetchTicketValidator>;

export default fetchTicketValidator;
