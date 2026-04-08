import { Hono } from "hono";

import {
  _fetchOrder,
  _fetchOrders,
  _createOrder,
} from "@controllers/order.controller";

import { authorizeUser } from "@middlewares/authorize.middleware";

import fetchOrdersValidator from "@validators/order/fetchOrders.validator";
import createOrderValidator from "@validators/order/createOrder.validator";

const router = new Hono();

router
  .basePath("/")
  .get(authorizeUser, fetchOrdersValidator, _fetchOrders)
  .post(authorizeUser, createOrderValidator, _createOrder);

router.basePath("/:id").get(authorizeUser, _fetchOrder);

export default router;
