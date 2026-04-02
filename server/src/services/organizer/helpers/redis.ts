import { client } from "@config/redis.config";

import { Organizer } from "@models/organizer.model";

/**
 * Expiry configuration for organizer cache.
 *
 * Defines the time-to-live for cached organizer data in seconds.
 */
export const EXPIRY = {
  PRIVATE_ORGANIZER: 30 * 60,
} as const;

/**
 * A service helper function that generates the cache key for an organizer.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The Redis cache key for the organizer.
 */
export const organizerCacheKey = (id: string) => {
  return `organizer:${id}`;
};

/**
 * A service helper function that retrieves cached organizer data.
 *
 * This function attempts to fetch organizer data from Redis. It
 * returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns The cached organizer data if present, otherwise null.
 */
export const getCachedOrganizer = async (id: string) => {
  try {
    const data = await client.json.get(organizerCacheKey(id));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that stores organizer data in cache.
 *
 * This function saves the organizer data in Redis with a defined expiry time.
 *
 * @param {string} id - The ID of the organizer.
 * @param {Organizer} organizer - The organizer data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
export const setCachedOrganizer = async (id: string, organizer: Organizer) => {
  const key = organizerCacheKey(id);

  try {
    await client.json.set(key, "$", Object(organizer));
    await client.expire(key, EXPIRY.PRIVATE_ORGANIZER);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that clears cached organizer data.
 *
 * This function removes the organizer data from Redis cache.
 *
 * @param {string} id - The ID of the organizer.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedOrganizer = async (id: string) => {
  try {
    await client.json.del(organizerCacheKey(id));
    return true;
  } catch (err) {
    return false;
  }
};
