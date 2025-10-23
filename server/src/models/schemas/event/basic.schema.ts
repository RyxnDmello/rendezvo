import { Schema } from "mongoose";

export interface Basic {
  title: string;
  category: string;
  description: string;
  tags: string[] | null;
}

const basicSchema = new Schema<Basic>({
  title: {
    type: Schema.Types.String,
    required: [true, "Event Title Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Event Title Must Be A Minimum Of 4 Characters"],
    maxLength: [25, "Event Title Must Be A Maximum Of 25 Characters"],
  },
  category: {
    type: Schema.Types.String,
    required: [true, "Event Category Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Event Category Must Be A Minimum Of 4 Characters"],
    maxLength: [10, "Event Category Must Be A Maximum Of 10 Characters"],
    match: [/^[A-Za-z]+$/, "Event Category Must Contain Only Letters"],
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Event Description Must Be Provided"],
    index: true,
    trim: true,
    minLength: [10, "Event Description Must Be A Minimum Of 10 Characters"],
    maxLength: [500, "Event Description Must Be A Maximum Of 500 Characters"],
  },
  tags: {
    type: [
      {
        type: Schema.Types.String,
        required: [true, "Event Tag Must Be Provided"],
        lowercase: true,
        trim: true,
        minLength: [4, "Event Tag Must Be A Minimum Of 4 Characters"],
        maxLength: [10, "Event Tag Must Be A Maximum Of 10 Characters"],
        match: [/^[A-Za-z]+$/, "Event Tag Must Contain Only Letters"],
      },
    ],
    required: false,
    index: true,
    validate: {
      validator: (value: string[]) => {
        return !value || (value.length >= 1 && value.length <= 10);
      },
      message: "Tags Must Be Between 1 And 10",
    },
    default: null,
  },
});

export default basicSchema;
