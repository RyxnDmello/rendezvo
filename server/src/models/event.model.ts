import { Schema, Types, model } from "mongoose";

import eventShopSchema, { EventShop } from "@schemas/event/shop.schema";
import eventRsvpSchema, { EventRsvp } from "@schemas/event/rsvp.schema";
import eventAlbumSchema, { EventAlbum } from "@schemas/event/album.schema";
import eventBasicSchema, { EventBasic } from "@schemas/event/basic.schema";
import eventPolicySchema, { EventPolicy } from "@schemas/event/policy.schema";
import eventTicketSchema, { EventTicket } from "@schemas/event/ticket.schema";
import eventCouponSchema, { EventCoupon } from "@schemas/event/coupon.schema";

import eventScheduleSchema, {
  EventSchedule,
} from "@schemas/event/schedule.schema";

import eventAddressSchema, {
  EventAddress,
} from "@schemas/event/address.schema";

import eventSecuritySchema, {
  EventSecurity,
} from "@schemas/event/security.schema";

/**
 * A type that represents the event's mode.
 *
 * - "online" - virtual events.
 * - "offline" - physical events.
 */
export type EventMode = "online" | "offline";

/**
 * A type that represents the event's status.
 *
 * - "active" - currently live.
 * - "inactive" - currently not live.
 */
export type EventStatus = "active" | "inactive";

/**
 * A type that represents the event's attendance type.
 *
 * - "open" - does not require RSVP details.
 * - "rsvp" - strictly requires RSVP details.
 */
export type EventAttendance = "open" | "rsvp";

/**
 * A type that represents the event's visibility.
 *
 * - "public" - event will be listed publicly to all users.
 * - "private" - event can only be shared to select users.
 */
export type EventVisibility = "public" | "private";

/**
 * An interface that represents an event.
 */
export interface Event {
  id?: string;
  _id?: Types.ObjectId;
  owner: Types.ObjectId;
  mode: EventMode;
  status: EventStatus;
  visibility: EventVisibility;
  attendance: EventAttendance;
  approved: boolean;
  basic: EventBasic;
  address: EventAddress;
  schedule: EventSchedule[];
  policy: EventPolicy;
  rsvp: EventRsvp | null;
  security: EventSecurity | null;
  tickets: EventTicket[] | null;
  coupons: EventCoupon[] | null;
  shop: EventShop | null;
  album: EventAlbum | null;
  createdAt?: EventSchedule;
  updatedAt?: EventSchedule;
}

const eventSchema = new Schema<Event>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "Event Owner ID Must Be Provided"],
      ref: "organizer",
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
      type: eventBasicSchema,
      required: [true, "Event Basic Details Must Be Provided"],
      index: true,
    },
    address: {
      _id: false,
      type: eventAddressSchema,
      required: [true, "Event Address Details Must Be Provided"],
      index: true,
    },
    schedule: {
      _id: false,
      type: [eventScheduleSchema],
      required: [true, "Event Schedule Must Be Provided"],
      index: true,
      validate: {
        validator: (dates: EventSchedule[]) => {
          return dates && dates.length >= 1 && dates.length <= 30;
        },
        message: "Event Schedule Can Have 1 To 30 Dates",
      },
    },
    policy: {
      _id: false,
      type: eventPolicySchema,
      required: [true, "Event Policy Details Must Be Provided"],
      index: true,
    },
    rsvp: {
      _id: false,
      type: eventRsvpSchema,
      required: false,
      index: true,
      default: null,
    },
    security: {
      _id: false,
      type: eventSecuritySchema,
      required: false,
      index: true,
      default: null,
    },
    tickets: {
      _id: false,
      type: [eventTicketSchema],
      required: false,
      index: true,
      validate: {
        validator: (values: EventTicket[]) => {
          return !values || (values.length >= 1 && values.length <= 20);
        },
        message: "Only 1 To 20 Tickets Are Allowed For An Event",
      },
      default: null,
    },
    coupons: {
      _id: false,
      type: [eventCouponSchema],
      required: false,
      index: true,
      validate: {
        validator: (values: EventCoupon[]) => {
          return !values || (values.length >= 1 && values.length <= 10);
        },
        message: "Only 1 To 10 Coupons Are Allowed For An Event",
      },
      default: null,
    },
    shop: {
      _id: false,
      type: eventShopSchema,
      required: false,
      index: true,
      default: null,
    },
    album: {
      _id: false,
      type: eventAlbumSchema,
      required: false,
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * The Event Mongoose Model.
 *
 * This model is used as an interface to interact with event documents in MongoDB.
 */
const EventModel = model("event", eventSchema);

export default EventModel;
