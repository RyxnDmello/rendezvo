import { Schema } from "mongoose";

export type Type = "single" | "multiple";

export interface Code {
  type: Type;
  active: boolean;
  code: string;
  uses: number;
  expiry: Date | null;
}

const codeSchema = new Schema<Code>({
  type: {
    type: Schema.Types.String,
    required: [true, "Security Code Type Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    enum: {
      values: ["single", "multiple"],
      message: "Invalid Security Code Type",
    },
    default: "multiple",
  },
  active: {
    type: Schema.Types.Boolean,
    required: true,
    index: true,
    default: true,
  },
  code: {
    type: Schema.Types.String,
    required: [true, "Security Code Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Security Code Must Be A Minimum Of 4 Characters"],
    maxLength: [10, "Security Code Must Be A Maximum Of 10 Characters"],
    match: [/^[A-Za-z0-9]+$/, "Security Code Must Contain Letters And Numbers"],
  },
  uses: {
    type: Schema.Types.Number,
    required: [true, "Security Code Uses Must Be Provided"],
    index: true,
    trim: true,
    min: [1, "Security Code Uses Must Be A Minimum Of 1"],
    max: [500, "Security Code Uses Must Be A Maximum Of 500"],
  },
  expiry: {
    type: Schema.Types.Date,
    required: false,
    index: true,
    default: null,
  },
});

export default codeSchema;
