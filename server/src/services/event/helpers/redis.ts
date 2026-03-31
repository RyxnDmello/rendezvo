import { client } from "@config/redis.config";

import { Event } from "@models/event.model";

export const EXPIRY = {
  PRIVATE_EVENT: 15 * 60,
  PRIVATE_EVENTS: 15 * 60,
} as const;

export const eventCacheKey = (id: string, ownerID: string) => {
  return `owner:${ownerID}:event:${id}`;
};

export const eventsCacheKey = (ownerID: string) => {
  return `owner:${ownerID}:events`;
};

export const getCachedEvent = async (id: string, ownerID: string) => {
  try {
    const data = await client.json.get(eventCacheKey(id, ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

export const getCachedEvents = async (ownerID: string) => {
  try {
    const data = await client.json.get(eventsCacheKey(ownerID));
    return data;
  } catch (err) {
    return null;
  }
};

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

export const clearCachedEvent = async (id: string, ownerID: string) => {
  try {
    await client.json.del(eventCacheKey(id, ownerID));
    return true;
  } catch (err) {
    return false;
  }
};

export const clearCachedEvents = async (ownerID: string) => {
  try {
    await client.json.del(eventsCacheKey(ownerID));
    return true;
  } catch (err) {
    return false;
  }
};
