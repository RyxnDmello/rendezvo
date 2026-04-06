import { Schema } from "mongoose";

/**
 * An interface that represents a ticket's pricing details.
 */
export interface EventTicketPricing {
  entry: number;
  cover: number;
  total: number;
}

const eventTicketPricingSchema = new Schema<EventTicketPricing>({
  entry: {
    type: Schema.Types.Number,
    required: [true, "Ticket Entry Fee Must Be Provided"],
    index: true,
    min: [0, "Ticket Entry Fee Cannot Be A Negative Number"],
    default: 0,
  },
  cover: {
    type: Schema.Types.Number,
    required: [true, "Ticket Cover Charge Must Be Provided"],
    index: true,
    min: [0, "Ticket Cover Charge Cannot Be A Negative Number"],
    default: 0,
  },
  total: {
    type: Schema.Types.Number,
    required: [true, "Ticket Price Must Be Provided"],
    index: true,
    min: [0, "Ticket Price Cannot Be A Negative Number"],
    default: 0,
  },
});

export default eventTicketPricingSchema;
