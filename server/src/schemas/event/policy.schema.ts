import { Schema } from "mongoose";

import eventTermsPolicySchema, {
  EventTermsPolicy,
} from "./policy/terms.schema";

import eventRefundPolicySchema, {
  EventRefundPolicy,
} from "./policy/refund.schema";

/**
 * An interface that represents an event's policies.
 */
export interface EventPolicy {
  terms: EventTermsPolicy;
  refund: EventRefundPolicy;
}

const eventPolicySchema = new Schema<EventPolicy>({
  terms: {
    _id: false,
    type: eventTermsPolicySchema,
    required: [true, "Terms And Conditions Must Be Provided"],
    index: true,
    default: {},
  },
  refund: {
    _id: false,
    type: eventRefundPolicySchema,
    required: [true, "Refund Policy Must Be Provided"],
    index: true,
    default: {},
  },
});

export default eventPolicySchema;
