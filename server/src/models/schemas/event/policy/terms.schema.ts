import { Schema } from "mongoose";

/**
 * An interface that represents an event's terms and conditions policy.
 */
export interface Terms {
  title: string;
  description: string;
}

const termsSchema = new Schema<Terms>({
  title: {
    type: Schema.Types.String,
    required: [true, "Terms Title Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Terms Title Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Terms Title Must Be A Maximum Of 50 Characters"],
    default: "General Event Term And Conditions",
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Terms Description Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Terms Description Must Be A Minimum Of 4 Characters"],
    maxLength: [500, "Terms Description Must Be A Maximum Of 500 Characters"],
    default: "",
  },
});

export default termsSchema;
