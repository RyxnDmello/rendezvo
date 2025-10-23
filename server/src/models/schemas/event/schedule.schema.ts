import { Schema } from "mongoose";

import slotSchema, { Slot } from "./schedule/slot.schema";

export type Type = "single" | "daily" | "weekly" | "custom";
export type Weekly = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface Schedule {
  type: Type;
  startDate: Date | null;
  startTime: string | null;
  endDate: Date | null;
  endTime: String | null;
  dates: Date[] | null;
  slots: Slot[] | null;
  weekly: Weekly[] | null;
  exceptions: Date[] | null;
}

const scheduleSchema = new Schema<Schedule>({
  type: {
    type: Schema.Types.String,
    required: [true, "Schedule Type Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    enum: {
      values: ["single", "daily", "weekly", "custom"],
      message: "Invalid Schedule Type",
    },
    default: "single",
  },
  startDate: {
    type: Schema.Types.Date,
    required: false,
    index: true,
    default: null,
  },
  startTime: {
    type: Schema.Types.String,
    required: false,
    index: true,
    trim: true,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Event Start Time Must Be In The 24 Hour Format",
    ],
    default: null,
  },
  endDate: {
    type: Schema.Types.Date,
    required: false,
    index: true,
    default: null,
  },
  endTime: {
    type: Schema.Types.String,
    required: false,
    index: true,
    trim: true,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Event End Time Must Be In The 24 Hour Format",
    ],
    default: null,
  },
  dates: {
    type: [
      {
        type: Schema.Types.Date,
        required: [true, "Schedule Date Must Be Provided"],
      },
    ],
    required: false,
    index: true,
    validate: {
      validator: (value: Date[]) => {
        return !value || (value.length >= 2 && value.length <= 30);
      },
      message: "Dates Must Be Between 2 And 30",
    },
    default: null,
  },
  slots: {
    type: [slotSchema],
    required: false,
    index: true,
    validate: {
      validator: (value: Slot[]) => {
        return !value || (value.length >= 2 && value.length <= 10);
      },
      message: "Time Slots Must Be Between 2 And 10",
    },
    default: null,
  },
  weekly: {
    type: [
      {
        type: Schema.Types.String,
        required: [true, "The Selected Days Of The Week Must Be Provided"],
        enum: {
          values: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
          message: "Invalid Day Of The Week Selected",
        },
      },
    ],
    required: false,
    index: true,
    validate: {
      validator: (value: Date[]) => {
        return !value || (value.length >= 1 && value.length <= 7);
      },
      message: "The Selected Days Of The Week Must Be Between 1 And 7",
    },
    default: null,
  },
  exceptions: {
    type: [
      {
        type: Schema.Types.Date,
        required: [true, "Exception Date Must Be Provided"],
      },
    ],
    required: false,
    index: true,
    validate: {
      validator: (value: Date[]) => {
        return !value || (value.length >= 1 && value.length <= 30);
      },
      message: "Exception Dates Must Be Between 1 And 30",
    },
    default: null,
  },
});

export default scheduleSchema;
