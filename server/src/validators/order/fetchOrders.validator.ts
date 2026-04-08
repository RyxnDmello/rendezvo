import * as z from "zod";

import { OrderStatus } from "@models/order.model";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const statuses: OrderStatus[] = [
  "open",
  "paid",
  "cancelled",
  "refunded",
  "closed",
];

const fetchOrdersValidatorSchema = z.strictObject(
  {
    status: z.enum(statuses, "Invalid Order Status Provided").optional(),
    title: z.string("Name Must Be A Valid Event Name").trim().optional(),
  },
  "Invalid Filters Provided",
);

/**
 * A validator middleware for orders retrieval requests.
 *
 * This middleware validates the request query against the orders retrieval schema.
 */
const fetchOrdersValidator = validator("query", fetchOrdersValidatorSchema);

/**
 * A type that represents the validated orders retrieval payload.
 */
export type FetchOrdersValidatorSchema = z.infer<
  typeof fetchOrdersValidatorSchema
>;

/**
 * A type that represents the Hono context with validated orders retrieval data.
 */
export type FetchOrdersContext = ValidatorContext<typeof fetchOrdersValidator>;

export default fetchOrdersValidator;
