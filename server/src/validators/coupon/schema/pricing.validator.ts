import * as z from "zod";

export const couponPricingValidatorSchema = z
  .strictObject(
    {
      type: z
        .enum(["fixed", "percentage"], "Invalid Coupon Pricing Type")
        .default("fixed"),
      amount: z
        .number("Coupon Amount/Percentage Must Be Provided")
        .min(1, "Coupon Amount/Percentage Cannot Be Less Than 1")
        .default(1),
      limit: z
        .number("Coupon Discount Limit Must Be A Valid Amount")
        .min(1, "Coupon Discount Limit Cannot Be Less Than 1")
        .optional(),
    },
    "Coupon Pricing Details Must Be Provided",
  )
  .superRefine((values, ctx) => {
    const { type, amount, limit } = values;

    if (type === "percentage") {
      if (!limit) {
        return ctx.addIssue({
          code: "custom",
          message: "Coupon Discount Limit Must Be Provided",
        });
      }

      if (amount > 100) {
        return ctx.addIssue({
          code: "custom",
          message: "Coupon Discount Percentage Must Be Between 1 And 100",
        });
      }

      return;
    }

    if (limit) {
      return ctx.addIssue({
        code: "custom",
        message: "A Fixed Pricing Coupon Cannot Have A Discount Limit",
      });
    }
  });

/**
 * A type that represents the validated coupon pricing details payload.
 */
export type CouponPricingValidatorSchema = z.infer<
  typeof couponPricingValidatorSchema
>;
