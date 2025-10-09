import { Schema } from "mongoose";

import socialSchema, { Social } from "./profile/socials.schema";

import mediaSchema, { Media } from "@schemas/media.schema";

export interface Profile {
  bio: string | null;
  image: Media | null;
  banner: Media | null;
  website: string | null;
  socials: Social[] | null;
}

const profileSchema = new Schema<Profile>({
  bio: {
    type: Schema.Types.String,
    required: false,
    trim: true,
    minLength: [4, "Bio Must Be A Minimum Of 4 Characters"],
    maxLength: [250, "Bio Must Be A Maximum Of 250 Characters"],
    default: null,
  },
  image: {
    _id: false,
    type: mediaSchema,
    required: false,
    default: null,
  },
  banner: {
    _id: false,
    type: mediaSchema,
    required: false,
    default: null,
  },
  website: {
    type: Schema.Types.String,
    required: false,
    lowercase: true,
    trim: true,
    default: null,
  },
  socials: {
    _id: false,
    type: [socialSchema],
    required: false,
    default: null,
  },
});

export default profileSchema;
