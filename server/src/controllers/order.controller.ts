import createOrder from "@services/order/createOrder";

import { CreateOrderContext } from "@validators/order/createOrder.validator";

export const _createOrder = async (ctx: CreateOrderContext) => {
  const user = ctx.get("user");

  const data = ctx.req.valid("json");

  const result = await createOrder(user.id, data);
  return ctx.json(result, 200);
};
