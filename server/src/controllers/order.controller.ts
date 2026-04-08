import { Context } from "hono";

import fetchOrder from "@services/order/fetchOrder";
import fetchOrders from "@services/order/fetchOrders";

import createOrder from "@services/order/createOrder";

import { FetchOrdersContext } from "@validators/order/fetchOrders.validator";
import { CreateOrderContext } from "@validators/order/createOrder.validator";

import ApiError from "@utils/ApiError";

/**
 * A controller function that retrieves an order of a user.
 *
 * @param {Context} ctx - A hono context.
 *
 * @returns A response of the retrieved order.
 */
export const _fetchOrder = async (ctx: Context) => {
  const user = ctx.get("user");

  const id = ctx.req.param("id");

  if (!id) {
    throw new ApiError("Event ID Must Be Provided", "BAD_REQUEST");
  }

  const order = await fetchOrder(id, user.id);
  return ctx.json(order, 200);
};

/**
 * A controller function that retrieves the orders of a user.
 *
 * @param {FetchOrdersContext} ctx - A hono context with FetchOrdersContext type support.
 *
 * @returns A response of all the retrieved orders.
 */
export const _fetchOrders = async (ctx: FetchOrdersContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("query");

  const orders = await fetchOrders(user.id, data);
  return ctx.json(orders, 200);
};

/**
 * A controller function that creates an order for an event.
 *
 * @param {CreateOrderContext} ctx - A hono context with CreateOrderContext type support.
 *
 * @returns A success response if the order is created.
 */
export const _createOrder = async (ctx: CreateOrderContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  const result = await createOrder(user.id, data);
  return ctx.json(result, 200);
};
