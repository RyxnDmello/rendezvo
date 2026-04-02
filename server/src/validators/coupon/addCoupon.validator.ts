import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

import { couponPricingValidatorSchema } from "./schema/pricing.validator";
import { couponQuantityValidatorSchema } from "./schema/quantity.validator";
import { couponScheduleValidatorSchema } from "./schema/schedule.validator";

const addCouponValidatorSchema = z
  .strictObject(
    {
      ticketID: z.string("Ticket ID Must Be A Valid ID").optional(),
      type: z
        .enum(["general", "targeted"], "Invalid Coupon Type")
        .default("general"),
      active: z
        .boolean("Coupon Must Be Either Active Or Inactive")
        .default(true),
      name: z
        .string("Coupon Name Must Be A Valid String")
        .min(4, "Coupon Name Must Be A Minimum Of 4 Characters")
        .max(50, "Coupon Name Must Be A Maximum Of 50 Characters")
        .regex(
          /^[A-Za-z\s]+$/,
          "Coupon Name Must Contain Only Letters And Spaces",
        ),
      description: z
        .string("Coupon Description Must Be A Valid String")
        .min(4, "Coupon Description Must Be A Minimum Of 4 Characters")
        .max(100, "Coupon Description Must Be A Maximum Of 100 Characters"),
      pricing: couponPricingValidatorSchema,
      quantity: couponQuantityValidatorSchema,
      schedule: couponScheduleValidatorSchema,
    },
    "Coupon Details Must Be Provided",
  )
  .superRefine((values, ctx) => {
    const { type, ticketID } = values;

    if (type === "general" && ticketID) {
      return ctx.addIssue({
        code: "custom",
        message: "General Coupons Cannot Have An Assigned Ticket",
      });
    }

    if (type === "targeted" && !ticketID) {
      return ctx.addIssue({
        code: "custom",
        message: "Targeted Coupons Must Have A Ticket Assigned",
      });
    }
  });

/**
 * A validator middleware for add coupon requests.
 *
 * This middleware validates the request body against the add coupon schema.
 */
const addCouponValidator = validator("json", addCouponValidatorSchema);

/**
 * A type that represents the validated add coupon payload.
 */
export type AddCouponValidatorSchema = z.infer<typeof addCouponValidatorSchema>;

/**
 * A type that represents the Hono context with validated add coupon data.
 */
export type AddCouponContext = ValidatorContext<typeof addCouponValidator>;

export default addCouponValidator;
