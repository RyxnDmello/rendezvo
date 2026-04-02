import { Schema, model } from "mongoose";

import { getDate } from "@helpers/date";

export type Type = "auth" | "reset";

/**
 * An interface that represents a verification.
 */
export interface Verification {
  id?: string;
  user?: string;
  type: Type;
  otp: string;
  expiredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const verificationSchema = new Schema<Verification>(
  {
    user: {
      type: Schema.Types.String,
      required: [true, "User ID Must Be Provided"],
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
    expiredAt: {
      type: Schema.Types.Date,
      required: [true, "Expiry Date Must Be Provided"],
      index: {
        expireAfterSeconds: 600,
      },
      default: () => {
        return getDate(10);
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * The Verification Mongoose Model.
 *
 * This model is used as an interface to interact with verification documents in MongoDB.
 */
const VerificationModel = model("verification", verificationSchema);

export default VerificationModel;
