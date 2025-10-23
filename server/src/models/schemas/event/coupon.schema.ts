import { Schema } from "mongoose";

import pricingSchema, { Pricing } from "./coupon/pricing.schema";
import quantitySchema, { Quantity } from "./coupon/quantity.schema";
import scheduleSchema, { Schedule } from "./coupon/schedule.schema";

export type Type = "general" | "targeted";

export interface Coupon {
  id: string;
  ticketID: string | null;
  type: Type;
  name: string;
  description: string;
  pricing: Pricing;
  quantity: Quantity;
  schedule: Schedule;
}

const couponSchema = new Schema<Coupon>({
  id: {
    type: Schema.Types.String,
    required: [true, "Coupon ID Must Be Provided"],
    index: true,
    trim: true,
  },
  ticketID: {
    type: Schema.Types.String,
    required: false,
    index: true,
    trim: true,
    default: null,
  },
  type: {
    type: Schema.Types.String,
    required: [true, "Coupon Type Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    enum: {
      values: ["general", "targeted"],
      message: "Invalid Coupon Type",
    },
    default: "general",
  },
  name: {
    type: Schema.Types.String,
    required: [true, "Coupon Name Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Coupon Name Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Coupon Name Must Be A Maximum Of 50 Characters"],
    match: [
      /^[A-Za-z\s]+$/,
      "Coupon Name Must Contain Only Letters And Spaces",
    ],
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Coupon Description Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Coupon Description Must Be A Minimum Of 4 Characters"],
    maxLength: [100, "Coupon Description Must Be A Maximum Of 100 Characters"],
  },
  pricing: {
    _id: false,
    type: pricingSchema,
    required: [true, "Coupon Pricing Must Be Provided"],
    index: true,
  },
  quantity: {
    _id: false,
    type: quantitySchema,
    required: [true, "Coupon Quantity Must Be Provided"],
    index: true,
  },
  schedule: {
    _id: false,
    type: scheduleSchema,
    required: [true, "Coupon Schedule Must Be Provided"],
    index: true,
  },
});

export default couponSchema;
