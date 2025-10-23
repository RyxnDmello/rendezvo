import { Schema } from "mongoose";

export type Type = "fixed" | "percentage";

export interface Pricing {
  type: Type;
  amount: number;
  limit: number | null;
}

const pricingSchema = new Schema<Pricing>({
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

export default pricingSchema;
