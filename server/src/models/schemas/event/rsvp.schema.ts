import { Schema } from "mongoose";

import fieldSchema, { Field } from "./rsvp/field.schema";
import responseSchema, { Response } from "./rsvp/response.schema";

/**
 * An interface that represents the event's RSVP details.
 */
export interface Rsvp {
  fields: Field[];
  responses: Response[];
}

const rsvpSchema = new Schema<Rsvp>({
  fields: {
    _id: false,
    type: [fieldSchema],
    required: [true, "Rsvp Fields Must Be Provided"],
    index: true,
    validate: {
      validator: (fields: Field[]) => {
        return fields.length >= 1 && fields.length <= 5;
      },
      message: "Fields Must Be Between 1 And 5",
    },
  },
  responses: {
    type: [responseSchema],
    required: [true, "Rsvp Responses Must Be Provided"],
    index: true,
  },
});

export default rsvpSchema;
