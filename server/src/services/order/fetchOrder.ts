import OrderModel, { Order } from "@models/order.model";

import { getCachedOrder, setCachedOrder } from "./helpers/redis";

import ApiError from "@utils/ApiError";

/**
 * A service function that retrieves a user's order.
 *
 * This function attempts to fetch the order from cache. If not found,
 * it retrieves the order from the database and caches the result.
 *
 * @param {string} id - The ID of the order.
 * @param {string} userID - The ID of the user.
 *
 * @returns The order data.
 *
 * @throws
 * - An ApiError if order does not exist.
 * - An ApiError if access is not authorized.
 */
const fetchOrder = async (id: string, userID: string) => {
  const order =
    (await getCachedOrder(id, userID)) ?? (await getOrder(id, userID));

  return order as Order;
};

/**
 * A service helper function that retrieves a user's order from the database.
 *
 * This function validates order existence and access permissions,
 * transforms the response, and stores it in cache.
 *
 * @param {string} id - The ID of the order.
 * @param {string} userID - The ID of the user.
 *
 * @returns The order data.
 *
 * @throws
 * - An ApiError if order does not exist.
 * - An ApiError if access is not authorized.
 */
const getOrder = async (id: string, userID: string) => {
  const dbOrder = await OrderModel.findById(id, {
    createdAt: 0,
    updatedAt: 0,
  })
    .populate({
      path: "event",
      select: {
        _id: 0,
        id: "$_id",
        mode: 1,
        status: 1,
        visibility: 1,
        attendance: 1,
        approved: 1,
        basic: 1,
        address: 1,
        album: 1,
      },
    })
    .lean({
      versionKey: false,
    });

  if (!dbOrder) {
    throw new ApiError("order With Given ID Does Not Exist", "BAD_REQUEST");
  }

  if (dbOrder.user.toString() !== userID) {
    throw new ApiError(
      "You Are Not Authorized To Retrieve This order",
      "FORBIDDEN",
    );
  }

  const { _id, ...data } = dbOrder;

  const order = {
    id,
    ...data,
  };

  await setCachedOrder(id, userID, order);

  return order;
};

export default fetchOrder;
