import { Schema, Types, model } from "mongoose";

import { getDate } from "@helpers/date";

import orderTicketSchema, { OrderTicket } from "@schemas/order/ticket.schema";
import orderCouponSchema, { OrderCoupon } from "@schemas/order/coupon.schema";

import orderPricingSchema, {
  OrderPricing,
} from "@schemas/order/pricing.schema";

import orderScheduleSchema, {
  OrderSchedule,
} from "@schemas/order/schedule.schema";

/**
 * A type that represents the order's status.
 *
 * - "open" - the order is created.
 * - "paid" - the order is paid.
 * - "refunded" - the order is refunded.
 * - "cancelled" - the order is cancelled.
 * - "closed" - the order is closed.
 */
export type OrderStatus = "open" | "paid" | "refunded" | "cancelled" | "closed";

/**
 * An interface that represents an order.
 */
export interface Order {
  id?: string;
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  owner: Types.ObjectId;
  event: Types.ObjectId;
  payment: Types.ObjectId | null;
  status: OrderStatus;
  tickets: OrderTicket[];
  coupons: OrderCoupon[] | null;
  pricing: OrderPricing;
  schedule: OrderSchedule;
  expiredAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID Must Be Provided"],
      ref: "user",
      index: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "Owner ID Must Be Provided"],
      ref: "organizer",
      index: true,
      trim: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      required: [true, "Event ID Must Be Provided"],
      ref: "event",
      index: true,
      trim: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "payment",
      index: true,
      trim: true,
      default: null,
    },
    status: {
      type: Schema.Types.String,
      required: [true, "Order Status Must Be Provided"],
      lowercase: true,
      index: true,
      enum: {
        values: ["open", "paid", "refunded", "cancelled", "closed"],
        message: "Invalid Order Status",
      },
      default: "open",
    },
    tickets: {
      _id: false,
      type: [orderTicketSchema],
      required: [true, "Order Tickets Must Be Provided"],
      index: true,
      validate: {
        validator: (values: OrderTicket[]) => {
          return values && values.length >= 1 && values.length <= 10;
        },
        message: "Only 1 To 10 Tickets Are Allowed For An Order",
      },
    },
    coupons: {
      _id: false,
      type: [orderCouponSchema],
      required: false,
      index: true,
      validate: {
        validator: (values: OrderCoupon[] | null) => {
          return !values || (values.length >= 1 && values.length <= 2);
        },
        message: "Only 1 To 2 Coupons Can Be Applied To An Order",
      },
      default: null,
    },
    pricing: {
      _id: false,
      type: orderPricingSchema,
      required: [true, "Order Pricing Must Be Provided"],
      index: true,
    },
    schedule: {
      _id: false,
      type: orderScheduleSchema,
      required: [true, "Order Schedule Must Be Provided"],
      index: true,
    },
    expiredAt: {
      type: Schema.Types.Date,
      required: [true, "Expiry Date Must Be Provided"],
      index: true,
      default: () => {
        return getDate(10);
      },
    },
  },
  {
    timestamps: true,
  },
);

const OrderModel = model("order", orderSchema);

export default OrderModel;
