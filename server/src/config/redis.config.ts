import { createClient } from "redis";

import { env } from "@constants/env";

const { REDIS_PORT, REDIS_HOST, REDIS_USERNAME, REDIS_PASSWORD } = env.REDIS;

/**
 * A Redis client, used to perform Redis operations.
 */
export const client = createClient({
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  socket: {
    port: REDIS_PORT,
    host: REDIS_HOST,
  },
});

client.on("error", () => {
  console.log("\n-------------------------");
  console.log("REDIS | CONNECTION FAILED");
  console.log("-------------------------");
  process.exit(0);
});

/**
 * A config function that sets default configurations and safely connects to Redis.
 */
const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.log("\n-------------------------");
    console.log("REDIS | CONNECTION FAILED");
    console.log("-------------------------");

    await client.quit();
    process.exit(0);
  }
};

export default connectRedis;
