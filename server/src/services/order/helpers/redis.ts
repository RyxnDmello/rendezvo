import { client } from "@config/redis.config";

import { Order } from "@models/order.model";

/**
 * Expiry configuration for order cache.
 *
 * Defines the time-to-live for cached order and orders data in seconds.
 */
export const EXPIRY = {
  ORDER: 30 * 60,
  ORDERS: 30 * 60,
} as const;

/**
 * A service helper function that generates the cache key for a single order.
 *
 * @param {string} id - The ID of the order.
 * @param {string} userID - The ID of the user.
 *
 * @returns The Redis cache key for the order.
 */
export const orderCacheKey = (id: string, userID: string) => {
  return `user:${userID}:order:${id}`;
};

/**
 * A service helper function that generates the cache key for multiple orders.
 *
 * @param {string} userID - The ID of the user.
 *
 * @returns The Redis cache key for the orders list.
 */
export const ordersCacheKey = (userID: string) => {
  return `user:${userID}:orders`;
};

/**
 * A service helper function that retrieves cached order data.
 *
 * This function attempts to fetch order data from Redis. It
 * returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} id - The ID of the order.
 * @param {string} userID - The ID of the user.
 *
 * @returns The cached order data if present, otherwise null.
 */
export const getCachedOrder = async (id: string, userID: string) => {
  try {
    const data = await client.json.get(orderCacheKey(id, userID));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that retrieves cached orders data.
 *
 * This function attempts to fetch multiple orders from Redis.
 * It returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} userID - The ID of the user.
 *
 * @returns The cached orders data if present, otherwise null.
 */
export const getCachedOrders = async (userID: string) => {
  try {
    const data = await client.json.get(ordersCacheKey(userID));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that stores order data in cache.
 *
 * This function saves the order data in Redis with a defined expiry time.
 *
 * @param {string} id - The ID of the order.
 * @param {string} userID - The ID of the user.
 * @param {Order} order - The order data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
export const setCachedOrder = async (
  id: string,
  userID: string,
  order: Order,
) => {
  const key = orderCacheKey(id, userID);

  try {
    await client.json.set(key, "$", Object(order));
    await client.expire(key, EXPIRY.ORDER);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that stores multiple orders in cache.
 *
 * This function saves the orders list in Redis with a defined expiry time.
 *
 * @param {string} userID - The ID of the user.
 * @param {Order[]} orders - The orders data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
export const setCachedOrders = async (userID: string, orders: Order[]) => {
  const key = ordersCacheKey(userID);

  try {
    await client.json.set(key, "$", Object(orders));
    await client.expire(key, EXPIRY.ORDERS);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that clears cached order data.
 *
 * This function removes the order from Redis cache.
 *
 * @param {string} id - The ID of the order.
 * @param {string} userID - The ID of the user.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedOrder = async (id: string, userID: string) => {
  try {
    await client.json.del(orderCacheKey(id, userID));
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that clears cached orders data.
 *
 * This function removes all orders for the user from Redis cache.
 *
 * @param {string} userID - The ID of the user.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedOrders = async (userID: string) => {
  try {
    await client.json.del(ordersCacheKey(userID));
    return true;
  } catch (err) {
    return false;
  }
};
