import { Schema } from "mongoose";

import termsSchema, { Terms } from "./policy/terms.schema";
import refundSchema, { Refund } from "./policy/refund.schema";

/**
 * An interface that represents an event's policies.
 */
export interface Policy {
  terms: Terms;
  refund: Refund;
}

const policySchema = new Schema<Policy>({
  terms: {
    _id: false,
    type: termsSchema,
    required: [true, "Terms And Conditions Must Be Provided"],
    index: true,
    default: {},
  },
  refund: {
    _id: false,
    type: refundSchema,
    required: [true, "Refund Policy Must Be Provided"],
    index: true,
    default: {},
  },
});

export default policySchema;
