import { Context, ErrorHandler } from "hono";

import MongooseError, {
  isMongooseError,
  MongooseErrorTypes,
} from "@utils/MongooseError";

import AppwriteError, {
  isAppwriteError,
  AppwriteErrorTypes,
} from "@utils/AppwriteError";

import ApiError, { isApiError, ApiErrorResponse } from "@utils/ApiError";

/**
 * A middleware that returns a useful error response when an error occurs.
 *
 * It tracks and resolves Errors, ApiErrors, MongooseErrors, and AppwriteErrors.
 * It then returns a useful response.
 *
 * @param {Error} error - An error instance.
 * @param {Context} ctx - A hono context.
 *
 * @returns An error response.
 *
 * @example
 * import onError from "@middlewares/onError.middleware.ts"
 *
 * const app = new Hono();
 *
 * app.onError(onError);
 */
const onError: ErrorHandler = (error: Error, ctx: Context) => {
  if (error instanceof ApiError) {
    return ctx.json(error.toJSON(), error.status);
  }

  if (error instanceof MongooseError) {
    return ctx.json(error.toJSON(), error.status);
  }

  if (error instanceof AppwriteError) {
    return ctx.json(error.toJSON(), error.status);
  }

  if (isApiError(error)) {
    const exception = error as ApiError;
    return ctx.json(exception.toJSON(), exception.status);
  }

  if (isMongooseError(error)) {
    const exception = new MongooseError(error as MongooseErrorTypes);
    return ctx.json(exception.toJSON(), exception.status);
  }

  if (isAppwriteError(error)) {
    const exception = new AppwriteError(error as AppwriteErrorTypes);
    return ctx.json(exception.toJSON(), exception.status);
  }

  return ApiErrorResponse(ctx, {
    error: "An Unexpected Error Has Occurred, Please Try Again Later",
    code: "INTERNAL_SERVER_ERROR",
  });
};

export default onError;
