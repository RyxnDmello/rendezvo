import { Schema } from "mongoose";

export interface Slot {
  active: boolean;
  startTime: string;
  endTime: String;
}

const slotSchema = new Schema<Slot>({
  active: {
    type: Schema.Types.Boolean,
    required: true,
    index: true,
    default: true,
  },
  startTime: {
    type: Schema.Types.String,
    required: [true, "Slot Start Time Must Be Provided"],
    index: true,
    trim: true,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Slot Start Time Must Be In The 24 Hour Format",
    ],
    default: "06:00",
  },
  endTime: {
    type: Schema.Types.String,
    required: [true, "Slot End Time Must Be Provided"],
    index: true,
    trim: true,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Slot End Time Must Be In The 24 Hour Format",
    ],
    default: "23:00",
  },
});

export default slotSchema;
