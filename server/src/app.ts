import { Hono } from "hono";

import connectRedis from "@services/redis.service";
import connectMongoDB from "@services/mongodb.service";

import tokenRoutes from "@routes/token.routes";
import eventRoutes from "@routes/event.routes";
import organizerRoutes from "@routes/organizer.routes";

const app = new Hono();

connectRedis();
connectMongoDB();

app.route("/api/token", tokenRoutes);
app.route("/api/event", eventRoutes);
app.route("/api/organizer", organizerRoutes);

export default app;
