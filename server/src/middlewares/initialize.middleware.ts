import connectRedis from "@config/redis.config";
import connectMongo from "@config/mongo.config";

const initialize = async () => {
  await Promise.all([connectMongo(), connectRedis()]);
};

export default initialize;
