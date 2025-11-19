import { Schema } from "mongoose";

export type Type = "image" | "video" | "file";

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
