import { Schema } from "mongoose";

/**
 * An interface that represents an event's refund policy.
 */
export interface Refund {
  title: string;
  duration: number;
  description: string;
}

const refundSchema = new Schema<Refund>({
  title: {
    type: Schema.Types.String,
    required: [true, "Refund Title Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Refund Title Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Refund Title Must Be A Maximum Of 50 Characters"],
    default: "7 Days Refund Policy",
  },
  duration: {
    type: Schema.Types.Number,
    required: [true, "Refund Duration Must Be Provided"],
    min: [7, "Refund Duration Must Be A Minimum Of 7 Days"],
    max: [14, "Refund Duration Must Be A Maximum Of 14 Days"],
    default: 7,
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Refund Description Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Refund Description Must Be A Minimum Of 4 Characters"],
    maxLength: [250, "Refund Description Must Be A Maximum Of 250 Characters"],
    default: "You are eligible for a refund 7 days before the event.",
  },
});

export default refundSchema;
