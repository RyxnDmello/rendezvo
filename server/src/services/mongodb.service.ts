import mongoose, { connect, disconnect } from "mongoose";

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("\n-------------------------------------");
    console.log("MONGODB ATLAS | CONNECTION SUCCESSFUL");
    console.log("-------------------------------------\n");

    return;
  }

  try {
    await connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB!,
      appName: process.env.MONGODB_APP!,
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
