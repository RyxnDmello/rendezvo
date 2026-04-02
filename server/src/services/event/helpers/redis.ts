import { client } from "@config/redis.config";

import { Event } from "@models/event.model";

/**
 * Expiry configuration for event cache.
 *
 * Defines the time-to-live for cached event and events data in seconds.
 */
export const EXPIRY = {
  PRIVATE_EVENT: 15 * 60,
  PRIVATE_EVENTS: 15 * 60,
} as const;

/**
 * A service helper function that generates the cache key for a single event.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The Redis cache key for the event.
 */
export const eventCacheKey = (id: string, ownerID: string) => {
  return `owner:${ownerID}:event:${id}`;
};

/**
 * A service helper function that generates the cache key for multiple events.
 *
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The Redis cache key for the events list.
 */
export const eventsCacheKey = (ownerID: string) => {
  return `owner:${ownerID}:events`;
};

/**
 * A service helper function that retrieves cached event data.
 *
 * This function attempts to fetch event data from Redis. It
 * returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The cached event data if present, otherwise null.
 */
export const getCachedEvent = async (id: string, ownerID: string) => {
  try {
    const data = await client.json.get(eventCacheKey(id, ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that retrieves cached events data.
 *
 * This function attempts to fetch multiple events from Redis.
 * It returns null if the cache is unavailable or an error occurs.
 *
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns The cached events data if present, otherwise null.
 */
export const getCachedEvents = async (ownerID: string) => {
  try {
    const data = await client.json.get(eventsCacheKey(ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * A service helper function that stores event data in cache.
 *
 * This function saves the event data in Redis with a defined expiry time.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 * @param {Event} event - The event data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
export const setCachedEvent = async (
  id: string,
  ownerID: string,
  event: Event,
) => {
  const key = eventCacheKey(id, ownerID);

  try {
    await client.json.set(key, "$", Object(event));
    await client.expire(key, EXPIRY.PRIVATE_EVENT);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that stores multiple events in cache.
 *
 * This function saves the events list in Redis with a defined expiry time.
 *
 * @param {string} ownerID - The ID of the organizer.
 * @param {Event[]} events - The events data to be cached.
 *
 * @returns True if the cache is successfully set, otherwise false.
 */
export const setCachedEvents = async (ownerID: string, events: Event[]) => {
  const key = eventsCacheKey(ownerID);

  try {
    await client.json.set(key, "$", Object(events));
    await client.expire(key, EXPIRY.PRIVATE_EVENTS);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that clears cached event data.
 *
 * This function removes the event from Redis cache.
 *
 * @param {string} id - The ID of the event.
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedEvent = async (id: string, ownerID: string) => {
  try {
    await client.json.del(eventCacheKey(id, ownerID));
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * A service helper function that clears cached events data.
 *
 * This function removes all events for the organizer from Redis cache.
 *
 * @param {string} ownerID - The ID of the organizer.
 *
 * @returns True if the cache is successfully cleared, otherwise false.
 */
export const clearCachedEvents = async (ownerID: string) => {
  try {
    await client.json.del(eventsCacheKey(ownerID));
    return true;
  } catch (err) {
    return false;
  }
};
