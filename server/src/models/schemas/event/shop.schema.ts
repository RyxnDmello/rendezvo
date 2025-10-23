import { Schema } from "mongoose";

import itemSchema, { Item } from "./shop/item.schema";

export interface Shop {
  name: string;
  description: string;
  itemsPerPerson: number;
  items: Item[];
}

const shopSchema = new Schema<Shop>({
  name: {
    type: Schema.Types.String,
    required: [true, "Shop Name Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Shop Name Must Be A Minimum Of 4 Characters"],
    maxLength: [50, "Shop Name Must Be A Maximum Of 50 Characters"],
    match: [/^[A-Za-z\s]+$/, "Shop Name Must Contain Only Letters And Spaces"],
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Shop Description Must Be Provided"],
    index: true,
    trim: true,
    minLength: [4, "Shop Description Must Be A Minimum Of 4 Characters"],
    maxLength: [250, "Shop Description Must Be A Maximum Of 250 Characters"],
  },
  itemsPerPerson: {
    type: Schema.Types.Number,
    required: [true, "Items Required Per Person Must Be Specified"],
    index: true,
    min: [1, "At Least 1 Item Must Be Allowed To Purchase"],
    max: [5, "At Most 5 Item Must Be Allowed To Purchase"],
    default: 1,
  },
  items: {
    type: [itemSchema],
    required: [true, "Items Must Be Provided"],
    index: true,
    validate: {
      validator: (value: Item[]) => {
        return value.length >= 1 && value.length <= 5;
      },
      message: "Items Must Be Between 1 And 5",
    },
  },
});

export default shopSchema;
