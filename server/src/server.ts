import { serve } from "bun";

import app from "./app";

const port = process.env.PORT || process.env.DEVELOPMENT_PORT!;

console.log(`ACTIVE | ${port}`);

serve({
  port,
  fetch: app.fetch,
});
