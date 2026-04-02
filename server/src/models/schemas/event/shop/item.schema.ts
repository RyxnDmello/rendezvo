import { Schema } from "mongoose";

import pricingSchema, { Pricing } from "./item/pricing.schema";
import quantitySchema, { Quantity } from "./item/quantity.schema";
import scheduleSchema, { Schedule } from "./item/schedule.schema";

/**
 * An interface that represents an item.
 */
export interface Item {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: Pricing;
  quantity: Quantity;
  schedule: Schedule;
}

const itemSchema = new Schema<Item>({
  id: {
    type: Schema.Types.String,
    required: [true, "Item ID Must Be Provided"],
    index: true,
    trim: true,
  },
  name: {
    type: Schema.Types.String,
    required: [true, "Item Name Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Item Name Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Item Name Must Be A Maximum Of 50 Characters"],
    match: [/^[A-Za-z\s]+$/, "Item Name Must Contain Only Letters And Spaces"],
  },
  category: {
    type: Schema.Types.String,
    required: [true, "Item Category Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Item Category Must Be A Minimum Of 4 Characters"],
    maxLength: [10, "Item Category Must Be A Maximum Of 10 Characters"],
    match: [/^[A-Za-z]+$/, "Item Category Must Contain Only Letters"],
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Item Description Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Item Description Must Be A Minimum Of 4 Characters"],
    maxLength: [100, "Item Description Must Be A Maximum Of 100 Characters"],
  },
  pricing: {
    _id: false,
    type: pricingSchema,
    required: [true, "Item Pricing Must Be Provided"],
    index: true,
  },
  quantity: {
    _id: false,
    type: quantitySchema,
    required: [true, "Item Quantity Must Be Provided"],
    index: true,
  },
  schedule: {
    _id: false,
    type: scheduleSchema,
    required: [true, "Item Schedule Must Be Provided"],
    index: true,
  },
});

export default itemSchema;
