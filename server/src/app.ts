import { Hono } from "hono";

import connectRedis from "@services/redis.service";
import connectMongoDB from "@services/mongodb.service";

import eventRoutes from "@routes/event.routes";

import userRoutes from "@routes/user.routes";
import organizerRoutes from "@routes/organizer.routes";

const app = new Hono();

connectRedis();
connectMongoDB();

app.route("/api/events", eventRoutes);

app.route("/api/users", userRoutes);
app.route("/api/organizers", organizerRoutes);

export default app;
