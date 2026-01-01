import { Hono } from "hono";

import { _refreshAccessToken } from "@controllers/token.controller";

import refreshAccessTokenValidator from "@validators/token/refreshAccessToken.validator";

const router = new Hono();

router.post("/refresh", refreshAccessTokenValidator, _refreshAccessToken);

export default router;
