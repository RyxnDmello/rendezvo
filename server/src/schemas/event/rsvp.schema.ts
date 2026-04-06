import { Schema } from "mongoose";

import eventRsvpFieldSchema, { EventRsvpField } from "./rsvp/field.schema";

import eventRsvpResponseSchema, {
  EventRsvpResponse,
} from "./rsvp/response.schema";

/**
 * An interface that represents the event's RSVP details.
 */
export interface EventRsvp {
  fields: EventRsvpField[];
  responses: EventRsvpResponse[];
}

const eventRsvpSchema = new Schema<EventRsvp>({
  fields: {
    _id: false,
    type: [eventRsvpFieldSchema],
    required: [true, "Rsvp Fields Must Be Provided"],
    index: true,
    validate: {
      validator: (fields: EventRsvpField[]) => {
        return fields.length >= 1 && fields.length <= 5;
      },
      message: "Fields Must Be Between 1 And 5",
    },
  },
  responses: {
    type: [eventRsvpResponseSchema],
    required: [true, "Rsvp Responses Must Be Provided"],
    index: true,
  },
});

export default eventRsvpSchema;
