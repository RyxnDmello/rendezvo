import { Hono } from "hono";

import connectMongoDB from "@services/mongodb.service";

import organizerRoutes from "@routes/organizer.routes";

const app = new Hono();

connectMongoDB();

app.route("/api/organizer", organizerRoutes);

export default app;
