import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const fetchCouponValidatorSchema = z.strictObject(
  {
    ownerID: z
      .string("Owner ID Must Be Provided")
      .trim()
      .nonempty("Owner ID Must Be Provided")
      .nonoptional("Owner ID Must Be Provided"),
  },
  "Only Event Owner ID Must Be Provided"
);

const fetchCouponValidator = validator("query", fetchCouponValidatorSchema);

export type FetchCouponValidatorSchema = z.infer<
  typeof fetchCouponValidatorSchema
>;

export type FetchCouponContext = ValidatorContext<typeof fetchCouponValidator>;

export default fetchCouponValidator;
