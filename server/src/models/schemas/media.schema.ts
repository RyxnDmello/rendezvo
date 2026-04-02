import { Schema } from "mongoose";

/**
 * A type that represents the type of media stored.
 *
 * - "image" - used for all image files.
 * - "video" - used for all video files.
 * - "file" - used for all non image and video files.
 */
export type Type = "image" | "video" | "file";

/**
 * An interface that represents a media.
 *
 * Since Appwrite is being used for file storage, we
 * only need to store the ID and type of the file.
 */
export interface Media {
  id: string;
  type: Type;
}

const mediaSchema = new Schema<Media>({
  id: {
    type: Schema.Types.String,
    required: [true, "Media ID Must Be Provided"],
    index: true,
    trim: true,
  },
  type: {
    type: Schema.Types.String,
    required: [true, "Media Type Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    enum: {
      values: ["image", "video", "file"],
      message: "Invalid Media Type",
    },
    default: "image",
  },
});

export default mediaSchema;
