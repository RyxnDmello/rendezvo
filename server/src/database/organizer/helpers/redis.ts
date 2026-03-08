import { client } from "@services/redis.service";

import { Organizer } from "@models/organizer.model";

export const EXPIRY = {
  PRIVATE_ORGANIZER: 30 * 60,
} as const;

export const organizerCacheKey = (id: string) => {
  return `organizer:${id}`;
};

export const getCachedOrganizer = async (id: string) => {
  try {
    const data = await client.json.get(organizerCacheKey(id));
    return data;
  } catch (err) {
    return null;
  }
};

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

export const clearCachedOrganizer = async (id: string) => {
  try {
    await client.json.del(organizerCacheKey(id));
    return true;
  } catch (err) {
    return false;
  }
};
