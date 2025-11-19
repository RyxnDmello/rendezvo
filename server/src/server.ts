import { serve } from "bun";

import { env } from "@constants/env";

import app from "./app";

const port = env.GLOBAL.PORT;

console.log(`ACTIVE | ${port}`);

serve({
  port,
  fetch: app.fetch,
});
