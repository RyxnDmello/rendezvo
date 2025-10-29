import { Hono } from "hono";

import { _refreshAccessToken } from "@controllers/token.controller";

const router = new Hono();

router.post("/refresh", _refreshAccessToken);

export default router;
