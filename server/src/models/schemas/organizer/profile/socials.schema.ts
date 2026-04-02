import { Schema } from "mongoose";

/**
 * An interface that represents the organizer's profile's social details.
 */
export interface Social {
  url: string;
  name: string;
}

const socialSchema = new Schema<Social>({
  url: {
    type: Schema.Types.String,
    required: [true, "Socials URL Must Be Provided"],
    lowercase: true,
    trim: true,
  },
  name: {
    type: Schema.Types.String,
    required: [true, "Socials Name Must Be Provided"],
    lowercase: true,
    trim: true,
    minLength: [4, "Socials Name Must Be A Minimum Of 4 Characters"],
    maxLength: [20, "Socials Name Must Be A Maximum Of 20 Characters"],
    match: [
      /^[A-Za-z\s]+$/,
      "Socials Name Must Contain Only Letters And Spaces",
    ],
  },
});

export default socialSchema;
