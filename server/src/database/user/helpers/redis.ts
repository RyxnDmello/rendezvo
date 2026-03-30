import { client } from "@services/redis.service";

import { User } from "@models/user.model";

export const EXPIRY = {
  PRIVATE_USER: 30 * 60,
} as const;

export const userCacheKey = (id: string) => {
  return `user:${id}`;
};

export const getCachedUser = async (id: string) => {
  try {
    const data = await client.json.get(userCacheKey(id));
    return data;
  } catch (err) {
    return null;
  }
};

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

export const clearCachedUser = async (id: string) => {
  try {
    await client.json.del(userCacheKey(id));
    return true;
  } catch (err) {
    return false;
  }
};
