import { Schema } from "mongoose";

/**
 * An interface that represents a ticket's quantity details.
 */
export interface EventTicketQuantity {
  sold: number;
  total: number;
  remaining: number;
}

const eventTicketQuantitySchema = new Schema<EventTicketQuantity>({
  sold: {
    type: Schema.Types.Number,
    required: [true, "Tickets Sold Must Be Provided"],
    index: true,
    min: [0, "Tickets Sold Cannot Be A Negative Number"],
    default: 0,
  },
  total: {
    type: Schema.Types.Number,
    required: [true, "Total Tickets Must Be Provided"],
    index: true,
    min: [0, "Total Tickets Must Be A Minimum Of 1"],
    max: [500, "Total Tickets Must Be A Maximum Of 500"],
    default: 500,
  },
  remaining: {
    type: Schema.Types.Number,
    required: [true, "Tickets Remaining Must Be Provided"],
    index: true,
    min: [0, "Tickets Remaining Cannot Be A Negative Number"],
    default: 0,
  },
});

export default eventTicketQuantitySchema;
