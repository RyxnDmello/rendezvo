import { Schema } from "mongoose";

import eventScheduleSlotSchema, {
  EventScheduleSlot,
} from "./schedule/slot.schema";

/**
 * An interface that represents an event date.
 */
export interface EventSchedule {
  active: boolean;
  date: Date;
  slots: EventScheduleSlot[];
}

const eventScheduleSchema = new Schema<EventSchedule>({
  active: {
    type: Schema.Types.Boolean,
    required: [true, "Event Date Must Either Be Enabled Or Disabled"],
    index: true,
    default: true,
  },
  date: {
    type: Schema.Types.Date,
    required: [true, "Event Date Must Be Provided"],
    index: true,
  },
  slots: {
    _id: false,
    type: [eventScheduleSlotSchema],
    required: [true, "Event Time Slots Must Be Provided"],
    index: true,
    validate: {
      validator: (slots: EventScheduleSlot[]) => {
        return slots && slots.length >= 1 && slots.length <= 10;
      },
      message: "Event Date Can Have 1 To 10 Time Slots",
    },
  },
});

export default eventScheduleSchema;
