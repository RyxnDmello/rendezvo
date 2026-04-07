import { Schema } from "mongoose";

/**
 * An interface that represents an order schedule.
 */
export interface OrderSchedule {
  date: Date;
  startTime: string;
  endTime: string;
}

const orderScheduleSchema = new Schema<OrderSchedule>({
  date: {
    type: Schema.Types.Date,
    required: [true, "Event Date Must Be Provided"],
    index: true,
  },
  startTime: {
    type: Schema.Types.String,
    required: [true, "Start Time Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    match: [
      /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
      "Start Time Must Be In The 24-Hour Format",
    ],
    default: "00:00",
  },
  endTime: {
    type: Schema.Types.String,
    required: [true, "End Time Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    match: [
      /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
      "End Time Must Be In The 24-Hour Format",
    ],
    default: "00:00",
  },
});

export default orderScheduleSchema;
