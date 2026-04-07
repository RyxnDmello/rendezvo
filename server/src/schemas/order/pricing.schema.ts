import { Schema } from "mongoose";

/**
 * An interface that represents an order's pricing details.
 */
export interface OrderPricing {
  entry: number;
  cover: number;
  total: number;
  discount: number;
}

const orderPricingSchema = new Schema<OrderPricing>({
  entry: {
    type: Schema.Types.Number,
    required: [true, "Total Tickets Entry Fee Must Be Provided"],
    index: true,
    min: [0, "Total Tickets Entry Fee Cannot Be A Negative Number"],
    default: 0,
  },
  cover: {
    type: Schema.Types.Number,
    required: [true, "Total Tickets Cover Charge Must Be Provided"],
    index: true,
    min: [0, "Total Tickets Cover Charge Cannot Be A Negative Number"],
    default: 0,
  },
  total: {
    type: Schema.Types.Number,
    required: [true, "Total Tickets Price Must Be Provided"],
    index: true,
    min: [0, "Total Tickets Price Cannot Be A Negative Number"],
    default: 0,
  },
  discount: {
    type: Schema.Types.Number,
    required: false,
    index: true,
    min: [0, "Total Tickets Discount Cannot Be A Negative Number"],
    default: 0,
  },
});

export default orderPricingSchema;
