import * as z from "zod";

export const couponQuantityValidatorSchema = z.strictObject(
  {
    total: z
      .number("Coupon Quantity Must Be A Valid Number")
      .min(1, "Coupon Quantity Must Be A Minimum Of 1")
      .max(500, "Coupon Quantity Must Be A Maximum Of 500"),
  },
  "Coupon Quantity Details Must Be Provided",
);

export type CouponQuantityValidatorSchema = z.infer<
  typeof couponQuantityValidatorSchema
>;
