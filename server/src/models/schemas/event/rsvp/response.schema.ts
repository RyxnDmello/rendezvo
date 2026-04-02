import { Schema } from "mongoose";

/**
 * An interface that represents an RSVP response.
 */
export interface Response {
  userID: string;
  orderID: string;
  data: Data[];
  date: Date;
}

/**
 * An interface that represents an RSVP response's data.
 */
interface Data {
  name: string;
  value: string | number | Date;
}

const dataSchema = new Schema<Data>({
  name: {
    type: Schema.Types.String,
    required: [true, "Data Name Must Be Provided"],
    uppercase: true,
    index: true,
    trim: true,
    minLength: [2, "Data Name Must Be A Minimum Of 2 Characters"],
    maxLength: [10, "Data Name Must Be A Maximum Of 10 Characters"],
    match: [/^[A-Za-z]+$/, "Data Name Must Contain Only Letters"],
  },
  value: {
    type: Schema.Types.Mixed,
    required: [true, "Value Must Be Provided"],
    validate: {
      validator: (value: string | number | Date) => {
        const type = typeof value;
        return type === "string" || type === "number" || value instanceof Date;
      },
      message: "Value Must Be A String, Number, Or Date",
    },
  },
});

const responseSchema = new Schema<Response>({
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
  data: {
    type: [dataSchema],
    required: [true, "Data Must Be Recorded"],
    index: true,
    default: [],
  },
  date: {
    type: Schema.Types.Date,
    required: [true, "Date Of Response Must Be Recorded"],
    index: true,
  },
});

export default responseSchema;
