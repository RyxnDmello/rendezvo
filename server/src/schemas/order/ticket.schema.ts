import { Schema } from "mongoose";

import orderTicketPricingSchema, {
  OrderTicketPricing,
} from "./ticket/pricing.schema";

/**
 * An interface that represents a ticket of an order.
 */
export interface OrderTicket {
  ticketID: string;
  quantity: number;
  pricing: OrderTicketPricing;
}

const orderTicketSchema = new Schema<OrderTicket>({
  ticketID: {
    type: Schema.Types.String,
    required: [true, "Ticket ID Linked To The Event Must Be Provided"],
    index: true,
    trim: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: [true, "Ticket Quantity Must Be Provided"],
    index: true,
    min: [1, "Ticket Quantity Must Be A Minimum Of 1"],
    max: [10, "Ticket Quantity Must Be A Maximum Of 10"],
    default: 1,
  },
  pricing: {
    _id: false,
    type: orderTicketPricingSchema,
    required: [true, "Ticket Pricing Must Be Provided"],
    index: true,
  },
});

export default orderTicketSchema;
