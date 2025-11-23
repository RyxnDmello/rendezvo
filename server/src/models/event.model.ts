import { Schema, model } from "mongoose";

import shopSchema, { Shop } from "@schemas/event/shop.schema";
import rsvpSchema, { Rsvp } from "@schemas/event/rsvp.schema";
import albumSchema, { Album } from "@schemas/event/album.schema";
import basicSchema, { Basic } from "@schemas/event/basic.schema";
import policySchema, { Policy } from "@schemas/event/policy.schema";
import ticketSchema, { Ticket } from "@schemas/event/ticket.schema";
import couponSchema, { Coupon } from "@schemas/event/coupon.schema";
import addressSchema, { Address } from "@schemas/event/address.schema";
import scheduleSchema, { Schedule } from "@schemas/event/schedule.schema";
import securitySchema, { Security } from "@schemas/event/security.schema";

export type Mode = "online" | "offline";
export type Status = "active" | "inactive";

export type Attendance = "open" | "rsvp";
export type Visibility = "public" | "private";

export interface Event {
  id?: string;
  ownerID: string;
  mode: Mode;
  status: Status;
  visibility: Visibility;
  attendance: Attendance;
  approved: boolean;
  basic: Basic;
  address: Address;
  schedule: Schedule;
  policy: Policy;
  rsvp: Rsvp | null;
  security: Security | null;
  tickets: Ticket[] | null;
  coupons: Coupon[] | null;
  shop: Shop | null;
  album: Album | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const eventSchema = new Schema<Event>(
  {
    ownerID: {
      type: Schema.Types.String,
      required: [true, "Event Owner ID Must Be Provided"],
      index: true,
      trim: true,
    },
    mode: {
      type: Schema.Types.String,
      required: [true, "Event Mode Must Be Provided"],
      lowercase: true,
      index: true,
      trim: true,
      enum: {
        values: ["online", "offline"],
        message: "Invalid Event Mode",
      },
      default: "offline",
    },
    status: {
      type: Schema.Types.String,
      required: [true, "Event Status Must Be Provided"],
      lowercase: true,
      index: true,
      trim: true,
      enum: {
        values: ["active", "inactive"],
        message: "Invalid Event Status",
      },
      default: "inactive",
    },
    visibility: {
      type: Schema.Types.String,
      required: [true, "Event Visibility Must Be Provided"],
      lowercase: true,
      index: true,
      trim: true,
      enum: {
        values: ["public", "private"],
        message: "Invalid Event Visibility",
      },
      default: "public",
    },
    attendance: {
      type: Schema.Types.String,
      required: [true, "Event Attendance Must Be Provided"],
      lowercase: true,
      index: true,
      trim: true,
      enum: {
        values: ["open", "rsvp"],
        message: "Invalid Event Attendance",
      },
      default: "open",
    },
    approved: {
      type: Schema.Types.Boolean,
      required: [true, "Event Approval Must Be Provided"],
      index: true,
      default: false,
    },
    basic: {
      _id: false,
      type: basicSchema,
      required: [true, "Event Basic Details Must Be Provided"],
      index: true,
    },
    address: {
      _id: false,
      type: addressSchema,
      required: [true, "Event Address Details Must Be Provided"],
      index: true,
    },
    schedule: {
      _id: false,
      type: scheduleSchema,
      required: [true, "Event Schedule Details Must Be Provided"],
      index: true,
    },
    policy: {
      _id: false,
      type: policySchema,
      required: [true, "Event Policy Details Must Be Provided"],
      index: true,
    },
    rsvp: {
      _id: false,
      type: rsvpSchema,
      required: false,
      index: true,
      default: null,
    },
    security: {
      _id: false,
      type: securitySchema,
      required: false,
      index: true,
      default: null,
    },
    tickets: {
      type: [ticketSchema],
      required: false,
      index: true,
      validate: {
        validator: (values: Ticket[]) => {
          return !values || (values.length >= 1 && values.length <= 20);
        },
        message: "Only 1 To 20 Tickets Are Allowed For An Event",
      },
      default: null,
    },
    coupons: {
      type: [couponSchema],
      required: false,
      index: true,
      validate: {
        validator: (values: Coupon[]) => {
          return !values || (values.length >= 1 && values.length <= 10);
        },
        message: "Only 1 To 10 Coupons Are Allowed For An Event",
      },
      default: null,
    },
    shop: {
      _id: false,
      type: shopSchema,
      required: false,
      index: true,
      default: null,
    },
    album: {
      _id: false,
      type: albumSchema,
      required: false,
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const EventModel = model("event", eventSchema);

export default EventModel;
