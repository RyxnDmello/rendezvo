import { Schema } from "mongoose";

export type Type = "image" | "video";

export interface Media {
  type: Type;
  url: string;
  name: string;
}

const mediaSchema = new Schema<Media>({
  type: {
    type: Schema.Types.String,
    required: [true, "Media Type Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    default: "image",
  },
  url: {
    type: Schema.Types.String,
    required: [true, "Media URL Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
  },
  name: {
    type: Schema.Types.String,
    required: [true, "Media Name Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
  },
});

export default mediaSchema;
