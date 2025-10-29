import mongoose, { connect, disconnect } from "mongoose";

import { env } from "@helpers/env";

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("\n-------------------------------------");
    console.log("MONGODB ATLAS | CONNECTION SUCCESSFUL");
    console.log("-------------------------------------\n");

    return;
  }

  try {
    await connect(env.MONGODB.MONGODB_URI, {
      dbName: env.MONGODB.MONGODB_DB,
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

    console.log("\n-------------------------------------");
    console.log("MONGODB ATLAS | CONNECTION SUCCESSFUL");
    console.log("-------------------------------------\n");
  } catch (error) {
    console.log("\n---------------------------------");
    console.log("MONGODB ATLAS | CONNECTION FAILED");
    console.log("---------------------------------\n");

    await disconnect();
  }
};

export default connectMongoDB;
