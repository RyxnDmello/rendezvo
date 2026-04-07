import { Schema, Types, model } from "mongoose";

import { Role } from "@constants/user";

/**
 * An interface that represents a session.
 */
export interface Session {
  id?: string;
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  ip: string;
  di: string;
  jti: string;
  iss: string;
  role: Role;
  token: string;
  expiredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const sessionSchema = new Schema<Session>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID Must Be Provided"],
      index: true,
      trim: true,
    },
    ip: {
      type: Schema.Types.String,
      required: [true, "User IP Address Must Be Provided"],
      lowercase: false,
      index: true,
      trim: true,
    },
    di: {
      type: Schema.Types.String,
      required: [true, "User Device ID Must Be Provided"],
      index: true,
      trim: true,
    },
    jti: {
      type: Schema.Types.String,
      required: [true, "Session Token ID Must Be Provided"],
      index: true,
      trim: true,
    },
    iss: {
      type: Schema.Types.String,
      required: [true, "Session Token Issuer Must Be Provided"],
      index: true,
      trim: true,
    },
    role: {
      type: Schema.Types.String,
      required: [true, "User Role Must Be Provided"],
      lowercase: true,
      index: true,
      trim: true,
      enum: {
        values: ["user", "admin", "organizer"],
        message: "Invalid User Role Provided",
      },
    },
    token: {
      type: Schema.Types.String,
      required: [true, "Session Token Must Be Provided"],
      index: true,
      trim: true,
    },
    expiredAt: {
      type: Schema.Types.Date,
      required: [true, "Session Expiry Must Be Provided"],
      index: {
        expireAfterSeconds: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * The Session Mongoose Model.
 *
 * This model is used as an interface to interact with session documents in MongoDB.
 */
const SessionModel = model("session", sessionSchema);

export default SessionModel;
