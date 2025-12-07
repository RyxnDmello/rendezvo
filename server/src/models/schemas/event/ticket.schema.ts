import { Schema, Types } from "mongoose";

import pricingSchema, { Pricing } from "./ticket/pricing.schema";
import quantitySchema, { Quantity } from "./ticket/quantity.schema";
import scheduleSchema, { Schedule } from "./ticket/schedule.schema";

export type Type = "free" | "paid";

export interface Ticket {
  id: string;
  type: Type;
  name: string;
  active: boolean;
  description: string;
  pricing: Pricing;
  quantity: Quantity;
  schedule: Schedule;
}

const ticketSchema = new Schema<Ticket>({
  id: {
    type: Schema.Types.String,
    required: [true, "Ticket ID Must Be Provided"],
    index: true,
    trim: true,
    default: new Types.ObjectId().toString(),
  },
  type: {
    type: Schema.Types.String,
    required: [true, "Ticket Type Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    enum: {
      values: ["free", "paid"],
      message: "Invalid Ticket Type",
    },
    default: "paid",
  },
  active: {
    type: Schema.Types.Boolean,
    required: [true, "Ticket Must Be Either Active Or Inactive"],
    index: true,
    default: true,
  },
  name: {
    type: Schema.Types.String,
    required: [true, "Ticket Name Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Ticket Name Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Ticket Name Must Be A Maximum Of 50 Characters"],
    match: [
      /^[A-Za-z\s]+$/,
      "Ticket Name Must Contain Only Letters And Spaces",
    ],
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Ticket Description Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Ticket Description Must Be A Minimum Of 4 Characters"],
    maxLength: [100, "Ticket Description Must Be A Maximum Of 100 Characters"],
  },
  pricing: {
    _id: false,
    type: pricingSchema,
    required: [true, "Ticket Pricing Must Be Provided"],
    index: true,
  },
  quantity: {
    _id: false,
    type: quantitySchema,
    required: [true, "Ticket Quantity Must Be Provided"],
    index: true,
  },
  schedule: {
    _id: false,
    type: scheduleSchema,
    required: [true, "Ticket Schedule Must Be Provided"],
    index: true,
  },
});

export default ticketSchema;
