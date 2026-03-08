import { Schema, model } from "mongoose";

import { getExpiryDate } from "@helpers/date";

export type Type = "auth" | "reset";

export interface Verification {
  id?: string;
  userID?: string;
  type: Type;
  otp: string;
  password: string | null;
  expiredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const verificationSchema = new Schema<Verification>(
  {
    userID: {
      type: Schema.Types.String,
      required: [true, "Event Owner ID Must Be Provided"],
      index: true,
      trim: true,
    },
    otp: {
      type: Schema.Types.String,
      required: [true, "OTP Must Be Provided"],
      index: true,
      trim: true,
      minLength: [6, "OTP Must Be 6 Digits"],
      maxLength: [6, "OTP Must Be 6 Digits"],
      match: [/^\d{6}$/, "OTP Must Be 6 Digits"],
    },
    type: {
      type: Schema.Types.String,
      required: [true, "Verification Type Must Be Provided"],
      index: true,
      trim: true,
      enum: {
        values: ["auth", "reset"],
        message: "Invalid Verification Type",
      },
    },
    password: {
      type: Schema.Types.String,
      required: false,
      trim: true,
      default: null,
    },
    expiredAt: {
      type: Date,
      required: [true, "Expiry Date Must Be Provided"],
      index: {
        expireAfterSeconds: 600,
      },
      default: () => {
        return getExpiryDate(10);
      },
    },
  },
  {
    timestamps: true,
  },
);

const VerificationModel = model("verification", verificationSchema);

export default VerificationModel;
