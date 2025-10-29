import { Hono } from "hono";

import connectMongoDB from "@services/mongodb.service";

import tokenRoutes from "@routes/token.routes";
import eventRoutes from "@routes/event.routes";
import organizerRoutes from "@routes/organizer.routes";
import verificationRoutes from "@routes/verification.routes";

const app = new Hono();

connectMongoDB();

app.route("/api/token", tokenRoutes);
app.route("/api/event", eventRoutes);
app.route("/api/organizer", organizerRoutes);
app.route("/api/verification", verificationRoutes);

export default app;
