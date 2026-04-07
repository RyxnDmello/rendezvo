import { Schema } from "mongoose";

import orderCouponPricingSchema, {
  OrderCouponPricing,
} from "./coupon/pricing.schema";

/**
 * An interface that represents a coupon of an order.
 */
export interface OrderCoupon {
  couponID: string;
  pricing: OrderCouponPricing;
}

const orderCouponSchema = new Schema<OrderCoupon>({
  couponID: {
    type: Schema.Types.String,
    required: [true, "Coupon ID Linked To The Event Must Be Provided"],
    index: true,
    trim: true,
  },
  pricing: {
    _id: false,
    type: orderCouponPricingSchema,
    required: [true, "Coupon Pricing Must Be Provided"],
    index: true,
  },
});

export default orderCouponSchema;
