import { Schema } from "mongoose";

import eventSecurityCodeSchema, {
  EventSecurityCode,
} from "./security/code.schema";

import evenSecurityRecordSchema, {
  EvenSecurityRecord,
} from "./security/record.schema";

/**
 * An interface that represents an event's security details.
 */
export interface EventSecurity {
  codes: EventSecurityCode[];
  records: EvenSecurityRecord[];
}

const eventSecuritySchema = new Schema<EventSecurity>({
  codes: {
    _id: false,
    type: [eventSecurityCodeSchema],
    required: [true, "Security Codes Must Be Provided"],
    index: true,
    validate: {
      validator: (codes: EventSecurityCode[]) => {
        return codes.length >= 1 && codes.length <= 10;
      },
      message: "Security Codes Must Be Between 1 And 10",
    },
  },
  records: {
    type: [evenSecurityRecordSchema],
    required: [true, "Security Code Records Must Be Provided"],
    index: true,
  },
});

export default eventSecuritySchema;
