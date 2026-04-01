import connectRedis from "@config/redis.config";
import connectMongo from "@config/mongo.config";

/**
 * A middleware that initializes any configurations.
 */
const initialize = async () => {
  await Promise.all([connectMongo(), connectRedis()]);
};

export default initialize;
