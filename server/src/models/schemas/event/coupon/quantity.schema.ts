import { Schema } from "mongoose";

/**
 * An interface that represents a coupon's quantity details.
 */
export interface Quantity {
  used: number;
  total: number;
  remaining: number;
}

const quantitySchema = new Schema<Quantity>({
  used: {
    type: Schema.Types.Number,
    required: [true, "Coupons Sold Must Be Provided"],
    index: true,
    min: [0, "Coupons Sold Cannot Be A Negative Number"],
    default: 0,
  },
  total: {
    type: Schema.Types.Number,
    required: [true, "Total Coupons Must Be Provided"],
    index: true,
    min: [0, "Total Coupons Must Be A Minimum Of 1"],
    max: [500, "Total Coupons Must Be A Maximum Of 500"],
    default: 500,
  },
  remaining: {
    type: Schema.Types.Number,
    required: [true, "Coupons Remaining Must Be Provided"],
    index: true,
    min: [0, "Coupons Remaining Cannot Be A Negative Number"],
    default: 0,
  },
});

export default quantitySchema;
