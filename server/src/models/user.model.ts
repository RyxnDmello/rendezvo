import { Schema, model } from "mongoose";

import preferenceSchema, { Preference } from "@schemas/user/preference.schema";

/**
 * An interface that represents a user.
 */
export interface User {
  id?: string;
  verified: boolean;
  name: string;
  email: string;
  mobile: number | null;
  password: string | null;
  preference: Preference;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<User>(
  {
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
      unique: [true, "Email Address Must Be Unique"],
      lowercase: true,
      index: true,
      trim: true,
      minLength: [10, "Email Must Be A Minimum Of 10 Characters"],
      maxLength: [250, "Email Must Be A Maximum Of 250 Characters"],
    },
    mobile: {
      type: Schema.Types.Number,
      required: false,
      unique: [true, "Mobile Number Must Be Unique"],
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
      trim: true,
      default: null,
    },
    preference: {
      _id: false,
      type: preferenceSchema,
      required: false,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

/**
 * The User Mongoose Model.
 *
 * This model is used as an interface to interact with user documents in MongoDB.
 */
const UserModel = model("user", userSchema);

export default UserModel;
