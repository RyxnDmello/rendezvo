import { Hono } from "hono";

import { _createOrder } from "@controllers/order.controller";

import { authorizeUser } from "@middlewares/authorize.middleware";

import createOrderValidator from "@validators/order/createOrder.validator";

const router = new Hono();

router.basePath("/").post(authorizeUser, createOrderValidator, _createOrder);

export default router;
