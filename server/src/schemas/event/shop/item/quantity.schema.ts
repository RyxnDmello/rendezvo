import { Schema } from "mongoose";

/**
 * An interface that represents the item's quantity details.
 */
export interface EventShopItemQuantity {
  sold: number;
  total: number;
  remaining: number;
}

const eventShopItemQuantitySchema = new Schema<EventShopItemQuantity>({
  sold: {
    type: Schema.Types.Number,
    required: [true, "Items Sold Must Be Provided"],
    index: true,
    min: [0, "Items Sold Cannot Be A Negative Number"],
    default: 0,
  },
  total: {
    type: Schema.Types.Number,
    required: [true, "Total Items Must Be Provided"],
    index: true,
    min: [0, "Total Items Must Be A Minimum Of 1"],
    max: [500, "Total Items Must Be A Maximum Of 500"],
    default: 500,
  },
  remaining: {
    type: Schema.Types.Number,
    required: [true, "Items Remaining Must Be Provided"],
    index: true,
    min: [0, "Items Remaining Cannot Be A Negative Number"],
    default: 0,
  },
});

export default eventShopItemQuantitySchema;
