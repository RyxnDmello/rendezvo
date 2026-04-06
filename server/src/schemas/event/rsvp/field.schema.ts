import { Schema } from "mongoose";

/**
 * A type that represents the RSVP form field types.
 *
 * - "date" - a date input field.
 * - "text" - a string input field.
 * - "number" - a number input field.
 * - "dropdown" - a string-based dropdown field.
 */
export type EventRsvpFieldType = "text" | "number" | "date" | "dropdown";

/**
 * An interface that represents the RSVP form field.
 */
export interface EventRsvpField {
  type: EventRsvpFieldType;
  name: string;
  label: string;
  active: boolean;
  placeholder: string;
  options: string[] | null;
  validator: EventRsvpFieldValidator;
}

/**
 * An interface that represents the RSVP form field's validation rules.
 */
export interface EventRsvpFieldValidator {
  required: boolean;
  min: number | null;
  max: number | null;
  minDate: Date | null;
  maxDate: Date | null;
  minLength: number | null;
  maxLength: number | null;
}

const eventRsvpFieldValidatorSchema = new Schema<EventRsvpFieldValidator>({
  required: {
    type: Schema.Types.Boolean,
    required: true,
    default: true,
  },
  min: {
    type: Schema.Types.Number,
    required: false,
    min: [-999999, "Minimum Number Validator Cannot Be Less Than -999999"],
    max: [999999, "Minimum Number Validator Cannot Be More Than 999999"],
    default: null,
  },
  max: {
    type: Schema.Types.Number,
    required: false,
    min: [-999999, "Maximum Number Validator Cannot Be Less Than -999999"],
    max: [999999, "Maximum Number Validator Cannot Be More Than 999999"],
    default: null,
  },
  minDate: {
    type: Schema.Types.Date,
    required: false,
    default: null,
  },
  maxDate: {
    type: Schema.Types.Date,
    required: false,
    default: null,
  },
  minLength: {
    type: Schema.Types.Number,
    required: false,
    min: [1, "Minimum Text Validator Cannot Be Less Than 1"],
    max: [50, "Minimum Text Validator Cannot Be More Than 50"],
    default: null,
  },
  maxLength: {
    type: Schema.Types.Number,
    required: false,
    min: [1, "Maximum Text Validator Cannot Be Less Than 1"],
    max: [50, "Maximum Text Validator Cannot Be More Than 50"],
    default: null,
  },
});

const eventRsvpFieldSchema = new Schema<EventRsvpField>({
  type: {
    type: Schema.Types.String,
    required: [true, "Field Type Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    enum: {
      values: ["text", "number", "date", "dropdown"],
      message: "Invalid Field Type Provided",
    },
    default: "text",
  },
  active: {
    type: Schema.Types.Boolean,
    required: true,
    index: true,
    default: true,
  },
  name: {
    type: Schema.Types.String,
    required: [true, "Field Name Must Be Provided"],
    uppercase: true,
    index: true,
    trim: true,
    minLength: [2, "Field Name Must Be A Minimum Of 2 Characters"],
    maxLength: [10, "Field Name Must Be A Maximum Of 10 Characters"],
    match: [/^[A-Za-z]+$/, "Field Name Must Contain Only Letters"],
  },
  label: {
    type: Schema.Types.String,
    required: [true, "Field Label Must Be Provided"],
    index: true,
    trim: true,
    minLength: [2, "Field Label Must Be A Minimum Of 2 Characters"],
    maxLength: [10, "Field Label Must Be A Maximum Of 10 Characters"],
    match: [/^[A-Za-z ]+$/, "Field Label Must Contain Only Letters"],
  },
  placeholder: {
    type: Schema.Types.String,
    required: [true, "Field Placeholder Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Field Description Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Field Description Must Be A Maximum Of 50 Characters"],
  },
  options: {
    type: [
      {
        type: Schema.Types.String,
        required: [true, "Dropdown Option Must Be Provided"],
        trim: true,
        minLength: [1, "Dropdown Option Must Be A Minimum Of 1 Character"],
        maxLength: [10, "Dropdown Option Must Be A Maximum Of 10 Characters"],
      },
    ],
    required: false,
    index: true,
    validate: {
      validator: (options: string[]) => {
        return !options || (options.length >= 2 && options.length <= 5);
      },
      message: "Dropdown Options Must Be Between 2 And 5 XXXXXXXXXXX",
    },
    default: null,
  },
  validator: {
    _id: false,
    type: eventRsvpFieldValidatorSchema,
    required: [true, "Field Validators Must Be Provided"],
    index: true,
    default: {},
  },
});

export default eventRsvpFieldSchema;
