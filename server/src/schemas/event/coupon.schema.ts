import { Schema, Types } from "mongoose";

import eventCouponPricingSchema, {
  EventCouponPricing,
} from "./coupon/pricing.schema";

import eventCouponQuantitySchema, {
  EventCouponQuantity,
} from "./coupon/quantity.schema";

import eventCouponScheduleSchema, {
  EventCouponSchedule,
} from "./coupon/schedule.schema";

/**
 * A type that represents the coupon type.
 *
 * - "general" - available to all tickets.
 * - "targeted" - available to a targeted ticket.
 */
export type EventCouponType = "general" | "targeted";

/**
 * An interface that represents a coupon.
 */
export interface EventCoupon {
  id: string;
  ticketID: string | null;
  type: EventCouponType;
  name: string;
  active: boolean;
  description: string;
  pricing: EventCouponPricing;
  quantity: EventCouponQuantity;
  schedule: EventCouponSchedule;
}

const eventCouponSchema = new Schema<EventCoupon>({
  id: {
    type: Schema.Types.String,
    required: [true, "Coupon ID Must Be Provided"],
    index: true,
    trim: true,
    default: new Types.ObjectId().toString(),
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
  active: {
    type: Schema.Types.Boolean,
    required: [true, "Coupon Must Be Either Active Or Inactive"],
    index: true,
    default: true,
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
    type: eventCouponPricingSchema,
    required: [true, "Coupon Pricing Must Be Provided"],
    index: true,
  },
  quantity: {
    _id: false,
    type: eventCouponQuantitySchema,
    required: [true, "Coupon Quantity Must Be Provided"],
    index: true,
  },
  schedule: {
    _id: false,
    type: eventCouponScheduleSchema,
    required: [true, "Coupon Schedule Must Be Provided"],
    index: true,
  },
});

export default eventCouponSchema;
