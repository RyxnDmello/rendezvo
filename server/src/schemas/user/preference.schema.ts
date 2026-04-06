import { Schema, Types } from "mongoose";

/**
 * A type that represents the user's preferred website theme.
 *
 * - "dark" - the dark theme of the website.
 * - "light" - the light theme of the website.
 * - "default" - the default theme of the system.
 */
export type UserPreferencesTheme = "light" | "dark" | "default";

/**
 * An interface that represents the user's preferences.
 */
export interface UserPreferences {
  theme: UserPreferencesTheme;
  events: Types.ObjectId[] | null;
  artists: Types.ObjectId[] | null;
}

const userPreferencesSchema = new Schema<UserPreferences>({
  theme: {
    type: Schema.Types.String,
    lowercase: true,
    required: false,
    trim: true,
    enum: {
      values: ["light", "dark", "default"],
      message: "Invalid System Theme Selected",
    },
    default: "default",
  },
  events: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "Event ID Must Be Provided"],
        ref: "event",
        trim: true,
      },
    ],
    required: false,
    validate: {
      validator: (values: Types.ObjectId[] | null) => {
        return !values || (values.length >= 1 && values.length <= 50);
      },
      message: "Only 50 Events Can Be Saved At A Time",
    },
    default: null,
  },
  artists: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "Artist ID Must Be Provided"],
        ref: "organizer",
        trim: true,
      },
    ],
    required: false,
    validate: {
      validator: (values: Types.ObjectId[] | null) => {
        return !values || (values.length >= 1 && values.length <= 50);
      },
      message: "Only 50 Artists Can Be Saved At A Time",
    },
    default: null,
  },
});

export default userPreferencesSchema;
