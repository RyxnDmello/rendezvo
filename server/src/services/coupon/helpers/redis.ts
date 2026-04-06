import { client } from "@config/redis.config";

import { EventCoupon } from "@schemas/event/coupon.schema";

/**
 * Expiry configuration for coupon cache.
 *
 * Defines the time-to-live for an event's coupon and coupons data in seconds.
 */
export const EXPIRY = {
  PRIVATE_COUPON: 15 * 60,
  PRIVATE_COUPONS: 15 * 60,
} as const;

/**
 * A service helper function that generates the cache key for an event's coupon.
 *
 * @param {string} id - The ID of the coupon.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The Redis cache key for the event's coupon.
 */
export const couponCacheKey = (
  id: string,
  eventID: string,
  ownerID: string,
) => {
  return `owner:${ownerID}:event:${eventID}:coupon:${id}`;
};

/**
 * A service helper function that generates the cache key for an event's coupons.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The Redis cache key for the event's coupons.
 */
export const couponsCacheKey = (eventID: string, ownerID: string) => {
  return `owner:${ownerID}:event:${eventID}:coupons`;
};

/**
 * A service helper function that retrieves an event's coupon from cache.
 *
 * This function attempts to fetch the coupon from Redis.
 * It returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} id - The ID of the coupon.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The cached coupon if present, otherwise null.
 */
export const getCachedCoupon = async (
  id: string,
  eventID: string,
  ownerID: string,
) => {
  try {
    const data = await client.json.get(couponCacheKey(id, eventID, ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that retrieves an event's coupons from cache.
 *
 * This function attempts to fetch the coupons from Redis.
 * It returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The cached coupons if present, otherwise null.
 */
export const getCachedCoupons = async (eventID: string, ownerID: string) => {
  try {
    const data = await client.json.get(couponsCacheKey(eventID, ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that stores an event's coupon in cache.
 *
 * This function saves the coupon in Redis with a defined expiry time.
 *
 * @param {string} id - The ID of the coupon.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {EventCoupon} coupon - The coupon data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
export const setCachedCoupon = async (
  id: string,
  eventID: string,
  ownerID: string,
  coupon: EventCoupon,
) => {
  const key = couponCacheKey(id, eventID, ownerID);

  try {
    await client.json.set(key, "$", Object(coupon));
    await client.expire(key, EXPIRY.PRIVATE_COUPON);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that stores an event's coupons in cache.
 *
 * This function saves the coupons list in Redis with a defined expiry time.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {EventCoupon[]} coupons - The coupons data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
export const setCachedCoupons = async (
  eventID: string,
  ownerID: string,
  coupons: EventCoupon[],
) => {
  const key = couponsCacheKey(eventID, ownerID);

  try {
    await client.json.set(key, "$", Object(coupons));
    await client.expire(key, EXPIRY.PRIVATE_COUPONS);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that clears an event's coupon from cache.
 *
 * This function removes the coupon from Redis.
 *
 * @param {string} id - The ID of the coupon.
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedCoupon = async (
  id: string,
  eventID: string,
  ownerID: string,
) => {
  try {
    await client.json.del(couponCacheKey(id, eventID, ownerID));
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that clears an event's coupons from cache.
 *
 * This function removes all coupons for the event from Redis.
 *
 * @param {string} eventID - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedCoupons = async (eventID: string, ownerID: string) => {
  try {
    await client.json.del(couponsCacheKey(eventID, ownerID));
    return true;
  } catch (err) {
    return false;
  }
};
