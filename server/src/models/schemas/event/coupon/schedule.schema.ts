import { Schema } from "mongoose";

export interface Schedule {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: String;
}

const scheduleSchema = new Schema<Schedule>({
  startDate: {
    type: Schema.Types.Date,
    required: [true, "Coupon Sales Start Date Must Be Provided"],
    index: true,
    validate: {
      validator: (value: Date) => {
        return value.getTime() > Date.now();
      },
      message: "Coupon Sales Start Date Must Be Set In The Future",
    },
  },
  startTime: {
    type: Schema.Types.String,
    required: [true, "Coupon Sales Start Time Must Be Provided"],
    index: true,
    trim: true,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Coupon Sales Start Time Must Be In The 24 Hour Format",
    ],
    default: "06:00",
  },
  endDate: {
    type: Schema.Types.Date,
    required: [true, "Coupon Sales End Date Must Be Provided"],
    index: true,
    validate: {
      validator: (value: Date) => {
        return value.getTime() > Date.now();
      },
      message: "Coupon Sales End Date Must Be Set In The Future",
    },
  },
  endTime: {
    type: Schema.Types.String,
    required: [true, "Coupon Sales End Time Must Be Provided"],
    index: true,
    trim: true,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Coupon Sales End Time Must Be In The 24 Hour Format",
    ],
    default: "11:00",
  },
});

export default scheduleSchema;
