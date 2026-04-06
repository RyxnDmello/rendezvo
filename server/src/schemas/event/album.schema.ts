import { Schema } from "mongoose";

import mediaSchema, { Media } from "@schemas/media.schema";

/**
 * An interface that represents the event's album.
 */
export interface EventAlbum {
  cover: Media | null;
  banner: Media | null;
  images: Media[] | null;
  videos: Media[] | null;
}

const eventAlbumSchema = new Schema<EventAlbum>({
  cover: {
    _id: false,
    type: mediaSchema,
    required: false,
    index: true,
    default: null,
  },
  banner: {
    _id: false,
    type: mediaSchema,
    required: false,
    index: true,
    default: null,
  },
  images: {
    _id: false,
    type: [mediaSchema],
    required: false,
    index: true,
    validate: {
      validator: (images: Media[]) => {
        return !images || (images.length >= 1 && images.length <= 5);
      },
      message: "A Maximum Of 5 Images Are Allowed For An Event",
    },
    default: null,
  },
  videos: {
    _id: false,
    type: [mediaSchema],
    required: false,
    index: true,
    validate: {
      validator: (videos: Media[]) => {
        return !videos || (videos.length >= 1 && videos.length <= 5);
      },
      message: "A Maximum Of 5 Videos Are Allowed For An Event",
    },
    default: null,
  },
});

export default eventAlbumSchema;
