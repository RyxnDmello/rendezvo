import { client } from "@config/redis.config";

import { User } from "@models/user.model";

/**
 * Expiry configuration for user cache.
 *
 * Defines the time-to-live for cached user data in seconds.
 */
export const EXPIRY = {
  PRIVATE_USER: 30 * 60,
} as const;

/**
 * A service helper function that generates the cache key for a user.
 *
 * @param {string} id - The ID of the user.
 *
 * @returns The Redis cache key for the user.
 */
export const userCacheKey = (id: string) => {
  return `user:${id}`;
};

/**
 * A service helper function that retrieves cached user data.
 *
 * This function attempts to fetch user data from Redis. It
 * returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} id - The ID of the user.
 *
 * @returns The cached user data if present, otherwise null.
 */
export const getCachedUser = async (id: string) => {
  try {
    const data = await client.json.get(userCacheKey(id));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that stores user data in cache.
 *
 * This function saves the user data in Redis with a defined expiry time.
 *
 * @param {string} id - The ID of the user.
 * @param {User} user - The user data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
export const setCachedUser = async (id: string, user: User) => {
  const key = userCacheKey(id);

  try {
    await client.json.set(key, "$", Object(user));
    await client.expire(key, EXPIRY.PRIVATE_USER);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that clears cached user data.
 *
 * This function removes the user data from Redis cache.
 *
 * @param {string} id - The ID of the user.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedUser = async (id: string) => {
  try {
    await client.json.del(userCacheKey(id));
    return true;
  } catch (err) {
    return false;
  }
};
