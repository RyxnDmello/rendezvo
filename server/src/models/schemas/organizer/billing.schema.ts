import { Schema } from "mongoose";

/**
 * An interface that represents the organizer's billing details.
 */
export interface Billing {
  bankName: string | null;
  bankBranch: string | null;
  accountName: string | null;
  accountNumber: string | null;
  accountExpiry: Date | null;
}

const billingSchema = new Schema<Billing>({
  bankName: {
    type: Schema.Types.String,
    required: false,
    trim: true,
    minLength: [4, "Bank Name Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Bank Name Must Be A Maximum Of 50 Characters"],
    match: [/^[A-Za-z\s]+$/, "Bank Name Must Contain Only Letters And Spaces"],
    default: null,
  },
  bankBranch: {
    type: Schema.Types.String,
    required: false,
    trim: true,
    minLength: [4, "Bank Branch Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Bank Branch Must Be A Maximum Of 50 Characters"],
    match: [
      /^[A-Za-z\s]+$/,
      "Bank Branch Must Contain Only Letters And Spaces",
    ],
    default: null,
  },
  accountName: {
    type: Schema.Types.String,
    required: false,
    uppercase: true,
    trim: true,
    minLength: [4, "Account Name Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Account Name Must Be A Maximum Of 50 Characters"],
    match: [
      /^[A-Za-z\s]+$/,
      "Account Name Must Contain Only Letters And Spaces",
    ],
    default: null,
  },
  accountNumber: {
    type: Schema.Types.String,
    required: false,
    trim: true,
    minLength: [10, "Account Number Must Be A Minimum Of 10 Digits"],
    maxLength: [20, "Account Number Must Be A Maximum Of 20 Digits"],
    match: [/^\d{10,20}$/, "Account Number Must Be 10 To 20 Digits"],
    default: null,
  },
  accountExpiry: {
    type: Schema.Types.Date,
    required: false,
    validate: {
      validator: (value: Date | null) => {
        if (!value) return true;
        return value > new Date();
      },
      message: "Account Expiry Date Must Be Set In The Future",
    },
    default: null,
  },
});

export default billingSchema;
