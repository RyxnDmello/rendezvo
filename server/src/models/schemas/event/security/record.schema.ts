import { Schema } from "mongoose";

/**
 * An interface that represents an event's security records.
 */
export interface Record {
  userID: string;
  orderID: string;
  code: string;
  date: Date;
}

const recordSchema = new Schema<Record>({
  userID: {
    type: Schema.Types.String,
    required: [true, "User ID Must Be Recorded"],
    index: true,
    trim: true,
  },
  orderID: {
    type: Schema.Types.String,
    required: [true, "Order ID Must Be Recorded"],
    index: true,
    trim: true,
  },
  code: {
    type: Schema.Types.String,
    required: [true, "Security Code Must Be Recorded"],
    index: true,
    trim: true,
    minLength: [4, "Security Code Must Be A Minimum Of 4 Characters"],
    maxLength: [10, "Security Code Must Be A Maximum Of 10 Characters"],
    match: [/^[A-Za-z0-9]+$/, "Security Code Must Contain Letters And Numbers"],
  },
  date: {
    type: Schema.Types.Date,
    required: [true, "Date Of Use Must Be Recorded"],
    index: true,
  },
});

export default recordSchema;
