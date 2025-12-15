import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const fetchCouponsValidatorSchema = z.strictObject(
  {
    ownerID: z
      .string("Owner ID Must Be Provided")
      .trim()
      .nonempty("Owner ID Must Be Provided")
      .nonoptional("Owner ID Must Be Provided"),
  },
  "Only Event Owner ID Must Be Provided"
);

const fetchCouponsValidator = validator("query", fetchCouponsValidatorSchema);

export type FetchCouponsValidatorSchema = z.infer<
  typeof fetchCouponsValidatorSchema
>;

export type FetchCouponsContext = ValidatorContext<
  typeof fetchCouponsValidator
>;

export default fetchCouponsValidator;
