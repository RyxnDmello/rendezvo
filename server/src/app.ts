import { Hono } from "hono";

import connectMongoDB from "@services/mongodb.service";

import organizerRoutes from "@routes/organizer.routes";
import verificationRoutes from "@routes/verification.routes";

const app = new Hono();

connectMongoDB();

app.route("/api/organizer", organizerRoutes);
app.route("/api/verification", verificationRoutes);

export default app;
