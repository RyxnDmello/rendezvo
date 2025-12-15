import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const toggleCouponValidatorSchema = z.strictObject(
  {
    ownerID: z
      .string("Owner ID Must Be Provided")
      .trim()
      .nonempty("Owner ID Must Be Provided")
      .nonoptional("Owner ID Must Be Provided"),
  },
  "Only Event Owner ID Must Be Provided"
);

const toggleCouponValidator = validator("query", toggleCouponValidatorSchema);

export type ToggleCouponValidatorSchema = z.infer<
  typeof toggleCouponValidatorSchema
>;

export type ToggleCouponContext = ValidatorContext<
  typeof toggleCouponValidator
>;

export default toggleCouponValidator;
