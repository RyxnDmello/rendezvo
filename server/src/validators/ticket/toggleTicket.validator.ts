import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const toggleTicketValidatorSchema = z.strictObject(
  {
    ownerID: z
      .string("Owner ID Must Be Provided")
      .trim()
      .nonempty("Owner ID Must Be Provided")
      .nonoptional("Owner ID Must Be Provided"),
  },
  "Only Event Owner ID Must Be Provided"
);

const toggleTicketValidator = validator("query", toggleTicketValidatorSchema);

export type ToggleTicketValidatorSchema = z.infer<
  typeof toggleTicketValidatorSchema
>;

export type ToggleTicketContext = ValidatorContext<
  typeof toggleTicketValidator
>;

export default toggleTicketValidator;
