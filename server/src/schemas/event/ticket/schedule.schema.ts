import { Schema } from "mongoose";

/**
 * An interface that represents a ticket's schedule details.
 */
export interface EventTicketSchedule {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: String;
}

const eventTicketScheduleSchema = new Schema<EventTicketSchedule>({
  startDate: {
    type: Schema.Types.Date,
    required: [true, "Ticket Sales Start Date Must Be Provided"],
    index: true,
    validate: {
      validator: (value: Date) => {
        return value.getTime() > Date.now();
      },
      message: "Ticket Sales Start Date Must Be Set In The Future",
    },
  },
  startTime: {
    type: Schema.Types.String,
    required: [true, "Ticket Sales Start Time Must Be Provided"],
    index: true,
    trim: true,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Ticket Sales Start Time Must Be In The 24 Hour Format",
    ],
    default: "06:00",
  },
  endDate: {
    type: Schema.Types.Date,
    required: [true, "Ticket Sales End Date Must Be Provided"],
    index: true,
    validate: {
      validator: (value: Date) => {
        return value.getTime() > Date.now();
      },
      message: "Ticket Sales End Date Must Be Set In The Future",
    },
  },
  endTime: {
    type: Schema.Types.String,
    required: [true, "Ticket Sales End Time Must Be Provided"],
    index: true,
    trim: true,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Ticket Sales End Time Must Be In The 24 Hour Format",
    ],
    default: "11:00",
  },
});

export default eventTicketScheduleSchema;
