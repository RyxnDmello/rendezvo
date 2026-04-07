import { Schema } from "mongoose";

/**
 * A type that represents a coupon's pricing type.
 *
 * - "fixed" - charged a fixed discount.
 * - "percentage" - charged a discount percentage with limits.
 */
export type OrderCouponPricingType = "fixed" | "percentage";

/**
 * An interface that represents a coupon's pricing details.
 */
export interface OrderCouponPricing {
  type: OrderCouponPricingType;
  amount: number;
  limit: number | null;
}

const orderCouponPricingSchema = new Schema<OrderCouponPricing>({
  type: {
    type: Schema.Types.String,
    required: [true, "Coupon Pricing Type Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    enum: {
      values: ["fixed", "percentage"],
      message: "Invalid Coupon Pricing Type",
    },
    default: "fixed",
  },
  amount: {
    type: Schema.Types.Number,
    required: [true, "Coupon Amount/Percentage Must Be Provided"],
    index: true,
    min: [1, "Coupon Amount/Percentage Cannot Be Less Than 1"],
    default: 1,
  },
  limit: {
    type: Schema.Types.Number,
    required: false,
    index: true,
    min: [1, "Coupon Discount Limit Cannot Be Less Than 1"],
    default: null,
  },
});

export default orderCouponPricingSchema;
