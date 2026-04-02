import { Schema } from "mongoose";

/**
 * An interface that represents the event's address.
 */
export interface Address {
  url: string | null;
  firstLine: string;
  secondLine: string | null;
  country: string;
  state: string;
  city: string;
  zip: string;
}

const addressSchema = new Schema<Address>({
  url: {
    type: Schema.Types.String,
    required: false,
    lowercase: true,
    index: true,
    trim: true,
    minLength: [4, "Address URL Must Be A Minimum Of 4 Characters"],
    maxLength: [25, "Address URL Must Be A Maximum Of 25 Characters"],
    match: [
      /^(https?:\/\/)?[a-z0-9]+([\-._][a-z0-9]+)*(\.[a-z]{2,})+(\/[a-z0-9\-._~:/?#[\]@!$&'()*+,;=%]*)?$/,
      "Address URL Must Be A Valid URL",
    ],
    validate: {
      validator: function (value: string) {
        return !value || /^[a-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(value);
      },
      message: "Address URL Must Be A Valid URL",
    },
    default: null,
  },
  firstLine: {
    type: Schema.Types.String,
    required: [true, "Address First Line Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Address First Line Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Address First Line Must Be A Maximum Of 50 Characters"],
  },
  secondLine: {
    type: Schema.Types.String,
    required: false,
    index: true,
    trim: true,
    minLength: [4, "Address Second Line Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Address Second Line Must Be A Maximum Of 50 Characters"],
    default: null,
  },
  country: {
    type: Schema.Types.String,
    required: [true, "Country Must Be Provided"],
    index: true,
    trim: true,
    minLength: [2, "Country Must Be A Minimum Of 2 Characters"],
    maxLength: [25, "Country Must Be A Maximum Of 25 Characters"],
  },
  state: {
    type: Schema.Types.String,
    required: [true, "State Must Be Provided"],
    index: true,
    trim: true,
    minLength: [2, "State Must Be A Minimum Of 2 Characters"],
    maxLength: [25, "State Must Be A Maximum Of 25 Characters"],
  },
  city: {
    type: Schema.Types.String,
    required: [true, "City Must Be Provided"],
    index: true,
    trim: true,
    minLength: [2, "City Must Be A Minimum Of 2 Characters"],
    maxLength: [25, "City Must Be A Maximum Of 25 Characters"],
  },
  zip: {
    type: Schema.Types.String,
    required: [true, "Zip Code Must Be Provided"],
    index: true,
    trim: true,
    minLength: [6, "Zip Code Must Be 6 Digits"],
    maxLength: [6, "Zip Code Must Be 6 Digits"],
    match: [/^\d{6}$/, "Zip Code Must Contain 6 Digits"],
  },
});

export default addressSchema;
