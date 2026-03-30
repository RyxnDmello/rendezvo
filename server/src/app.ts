import { Hono } from "hono";

import connectRedis from "@services/redis.service";
import connectMongoDB from "@services/mongodb.service";

import eventRoutes from "@routes/event.routes";

import userRoutes from "@routes/user.routes";
import organizerRoutes from "@routes/organizer.routes";

const app = new Hono();

connectRedis();
connectMongoDB();

app.route("/api/event", eventRoutes);

app.route("/api/user", userRoutes);
app.route("/api/organizer", organizerRoutes);

export default app;
