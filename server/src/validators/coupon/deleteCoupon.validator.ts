import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const deleteCouponValidatorSchema = z.strictObject(
  {
    ownerID: z
      .string("Owner ID Must Be Provided")
      .trim()
      .nonempty("Owner ID Must Be Provided")
      .nonoptional("Owner ID Must Be Provided"),
  },
  "Only Event Owner ID Must Be Provided"
);

const deleteCouponValidator = validator("query", deleteCouponValidatorSchema);

export type DeleteCouponValidatorSchema = z.infer<
  typeof deleteCouponValidatorSchema
>;

export type DeleteCouponContext = ValidatorContext<
  typeof deleteCouponValidator
>;

export default deleteCouponValidator;
