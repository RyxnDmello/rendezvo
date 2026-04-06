import { Schema } from "mongoose";

import organizerProfileSocialSchema, {
  OrganizerProfileSocial,
} from "./profile/socials.schema";

import mediaSchema, { Media } from "@schemas/media.schema";

/**
 * An interface that represents the organizer's profile details.
 */
export interface OrganizerProfile {
  bio: string | null;
  image: Media | null;
  banner: Media | null;
  website: string | null;
  socials: OrganizerProfileSocial[] | null;
}

const organizerProfileSchema = new Schema<OrganizerProfile>({
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
    type: [organizerProfileSocialSchema],
    required: false,
    default: null,
  },
});

export default organizerProfileSchema;
