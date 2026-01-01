import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

import { couponPricingValidatorSchema } from "./schema/pricing.validator";
import { couponQuantityValidatorSchema } from "./schema/quantity.validator";
import { couponScheduleValidatorSchema } from "./schema/schedule.validator";

const updateCouponValidatorSchema = z
  .strictObject(
    {
      action: z.enum(
        ["basic", "pricing", "quantity", "schedule"],
        "Provide The Specific Action You Need To Perform"
      ),
      name: z
        .string("Coupon Name Must Be A Valid String")
        .min(4, "Coupon Name Must Be A Minimum Of 4 Characters")
        .max(50, "Coupon Name Must Be A Maximum Of 50 Characters")
        .regex(
          /^[A-Za-z\s]+$/,
          "Coupon Name Must Contain Only Letters And Spaces"
        )
        .optional(),
      description: z
        .string("Coupon Description Must Be A Valid String")
        .min(4, "Coupon Description Must Be A Minimum Of 4 Characters")
        .max(100, "Coupon Description Must Be A Maximum Of 100 Characters")
        .optional(),
      pricing: couponPricingValidatorSchema.optional(),
      quantity: couponQuantityValidatorSchema.optional(),
      schedule: couponScheduleValidatorSchema.optional(),
    },
    "Coupon Details Must Be Provided"
  )
  .superRefine((values, ctx) => {
    const { action, ...fields } = values;

    if (action === "basic") return;

    const type = action[0]?.toUpperCase() + action.substring(1);

    if (!fields[action]) {
      return ctx.addIssue({
        code: "custom",
        message: `Event ${type} Details Must Be Provided`,
      });
    }

    const others = ["pricing", "quantity", "schedule"].filter(
      (key) => key !== action
    );

    for (const key of others) {
      if (fields[key as keyof typeof fields] !== undefined) {
        return ctx.addIssue({
          code: "custom",
          message: `Only Coupon ${type} Details Must Be Provided`,
        });
      }
    }
  });

const updateCouponValidator = validator("json", updateCouponValidatorSchema);

export type UpdateCouponValidatorSchema = z.infer<
  typeof updateCouponValidatorSchema
>;

export type UpdateCouponContext = ValidatorContext<
  typeof updateCouponValidator
>;

export default updateCouponValidator;
