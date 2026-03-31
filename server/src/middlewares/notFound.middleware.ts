import { NotFoundHandler } from "hono";

import { ApiErrorResponse } from "@utils/ApiError";

const notFound: NotFoundHandler = (ctx) => {
  return ApiErrorResponse(ctx, {
    error: "This Service Requested Does Not Exist",
    code: "NOT_FOUND",
  });
};

export default notFound;
