import { Schema } from "mongoose";

import codeSchema, { Code } from "./security/code.schema";
import recordSchema, { Record } from "./security/record.schema";

/**
 * An interface that represents an event's security details.
 */
export interface Security {
  codes: Code[];
  records: Record[];
}

const securitySchema = new Schema<Security>({
  codes: {
    _id: false,
    type: [codeSchema],
    required: [true, "Security Codes Must Be Provided"],
    index: true,
    validate: {
      validator: (codes: Code[]) => {
        return codes.length >= 1 && codes.length <= 10;
      },
      message: "Security Codes Must Be Between 1 And 10",
    },
  },
  records: {
    type: [recordSchema],
    required: [true, "Security Code Records Must Be Provided"],
    index: true,
  },
});

export default securitySchema;
