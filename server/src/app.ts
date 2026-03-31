import { Hono } from "hono";

import onError from "@middlewares/onError.middleware";
import notFound from "@middlewares/notFound.middleware";
import initialize from "@middlewares/initialize.middleware";

import eventRoutes from "@routes/event.routes";

import userRoutes from "@routes/user.routes";
import organizerRoutes from "@routes/organizer.routes";

await initialize();

const app = new Hono();

app.onError(onError);
app.notFound(notFound);

app.route("/api/events", eventRoutes);

app.route("/api/users", userRoutes);
app.route("/api/organizers", organizerRoutes);

export default app;
