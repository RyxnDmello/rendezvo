import { Schema } from "mongoose";

/**
 * An interface that represents an event time slot.
 */
export interface EventScheduleSlot {
  active: boolean;
  startTime: string;
  endTime: string;
}

const eventScheduleSlotSchema = new Schema<EventScheduleSlot>({
  active: {
    type: Schema.Types.Boolean,
    required: [true, "A Time Slot Must Either Be Enabled Or Disabled"],
    index: true,
    default: true,
  },
  startTime: {
    type: Schema.Types.String,
    required: [true, "Slot Start Time Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    match: [
      /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
      "Slot Start Time Must Be In The 24-Hour Format",
    ],
    default: "00:00",
  },
  endTime: {
    type: Schema.Types.String,
    required: [true, "Slot End Time Must Be Provided"],
    lowercase: true,
    index: true,
    trim: true,
    match: [
      /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
      "Slot End Time Must Be In The 24-Hour Format",
    ],
    default: "00:00",
  },
});

export default eventScheduleSlotSchema;
