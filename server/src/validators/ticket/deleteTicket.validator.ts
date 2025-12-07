import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const deleteTicketValidatorSchema = z.strictObject(
  {
    ownerID: z
      .string("Owner ID Must Be Provided")
      .trim()
      .nonempty("Owner ID Must Be Provided")
      .nonoptional("Owner ID Must Be Provided"),
  },
  "Only Event Owner ID Must Be Provided"
);

const deleteTicketValidator = validator("query", deleteTicketValidatorSchema);

export type DeleteTicketValidatorSchema = z.infer<
  typeof deleteTicketValidatorSchema
>;

export type DeleteTicketContext = ValidatorContext<
  typeof deleteTicketValidator
>;

export default deleteTicketValidator;
