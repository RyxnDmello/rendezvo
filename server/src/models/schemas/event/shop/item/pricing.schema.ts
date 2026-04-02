import { Schema } from "mongoose";

/**
 * An interface that represents the item's pricing details.
 */
export interface Pricing {
  amount: number;
  original: number;
  discount: number | null;
}

const pricingSchema = new Schema<Pricing>({
  amount: {
    type: Schema.Types.Number,
    required: [true, "Item Price Must Be Provided"],
    index: true,
    min: [1, "Item Price Cannot Be Less Than 1"],
    default: 1,
  },
  original: {
    type: Schema.Types.Number,
    required: [true, "Item Original Price Must Be Provided"],
    index: true,
    min: [1, "Item Original Price Cannot Be Less Than 1"],
    default: 1,
  },
  discount: {
    type: Schema.Types.Number,
    required: false,
    index: true,
    min: [1, "Item Discount Price Cannot Be Less Than 1"],
    default: null,
  },
});

export default pricingSchema;
