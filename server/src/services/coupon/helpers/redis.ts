import { client } from "@config/redis.config";

import { Coupon } from "@schemas/event/coupon.schema";

export const EXPIRY = {
  PRIVATE_COUPON: 15 * 60,
  PRIVATE_COUPONS: 15 * 60,
} as const;

export const couponCacheKey = (
  id: string,
  eventID: string,
  ownerID: string,
) => {
  return `owner:${ownerID}:event:${eventID}:coupon:${id}`;
};

export const couponsCacheKey = (eventID: string, ownerID: string) => {
  return `owner:${ownerID}:event:${eventID}:coupons`;
};

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

export const getCachedCoupons = async (eventID: string, ownerID: string) => {
  try {
    const data = await client.json.get(couponsCacheKey(eventID, ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

export const setCachedCoupon = async (
  id: string,
  eventID: string,
  ownerID: string,
  coupon: Coupon,
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

export const setCachedCoupons = async (
  eventID: string,
  ownerID: string,
  coupons: Coupon[],
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

export const clearCachedCoupons = async (eventID: string, ownerID: string) => {
  try {
    await client.json.del(couponsCacheKey(eventID, ownerID));
    return true;
  } catch (err) {
    return false;
  }
};
