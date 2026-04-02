import mongoose, { connect, disconnect } from "mongoose";

import { env } from "@constants/env";

/**
 * A config function that sets default configurations and safely connects to MongoDB.
 */
const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await connect(env.MONGODB.MONGODB_URI, {
      dbName: env.MONGODB.MONGODB_DATABASE,
      appName: env.MONGODB.MONGODB_APP,
      retryReads: true,
      retryWrites: true,
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });

    await mongoose.connection.db?.admin().command({
      ping: 1,
    });
  } catch (error) {
    console.log("\n---------------------------------");
    console.log("MONGODB ATLAS | CONNECTION FAILED");
    console.log("---------------------------------\n");

    await disconnect();
    process.exit(0);
  }
};

export default connectMongo;
