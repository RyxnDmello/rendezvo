import { Schema, model } from "mongoose";

import profileSchema, { Profile } from "@schemas/organizer/profile.schema";
import billingSchema, { Billing } from "@schemas/organizer/billing.schema";

export interface Organizer {
  id?: string;
  artistID: string | null;
  verified: boolean;
  name: string;
  email: string;
  mobile: number | null;
  password: string | null;
  profile: Profile | null;
  billing: Billing | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const organizerSchema = new Schema<Organizer>(
  {
    artistID: {
      type: Schema.Types.String,
      required: false,
      index: true,
      trim: true,
      default: null,
    },
    verified: {
      type: Schema.Types.Boolean,
      required: false,
      index: true,
      default: false,
    },
    name: {
      type: Schema.Types.String,
      required: [true, "Name Must Be Provided"],
      index: true,
      trim: true,
      minLength: [4, "Name Must Be A Minimum Of 4 Characters"],
      maxLength: [50, "Name Must Be A Maximum Of 50 Characters"],
      match: [/^[A-Za-z\s]+$/, "Name Must Contain Only Letters And Spaces"],
    },
    email: {
      type: Schema.Types.String,
      required: [true, "Email Must Be Provided"],
      lowercase: true,
      unique: true,
      index: true,
      trim: true,
      minLength: [10, "Email Must Be A Minimum Of 10 Characters"],
      maxLength: [250, "Email Must Be A Maximum Of 250 Characters"],
    },
    mobile: {
      type: Schema.Types.Number,
      required: false,
      validate: {
        validator: (value: number) => {
          return ["6", "7", "8", "9"].includes(value.toString()[0]!);
        },
        message: "Mobile Number Must Start With 6, 7, 8, Or 9",
      },
      min: [6000000000, "Mobile Number Must Be 10 Digits"],
      max: [9999999999, "Mobile Number Must Be 10 Digits"],
      default: null,
    },
    password: {
      type: Schema.Types.String,
      required: false,
      minLength: [8, "Password Must Be A Minimum Of 8 Characters"],
      maxLength: [50, "Password Must Be A Maximum Of 50 Characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/,
        "Password Must Contain At Least 1 Lowercase, 1 Uppercase, 1 Digit, And 1 Special Character",
      ],
      default: null,
    },
    profile: {
      _id: false,
      type: profileSchema,
      required: false,
      default: null,
    },
    billing: {
      _id: false,
      type: billingSchema,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const OrganizerModel = model("organizer", organizerSchema);

export default OrganizerModel;
