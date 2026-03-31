import { ErrorHandler } from "hono";

import MongooseError, {
  isMongooseError,
  MongooseErrorTypes,
} from "@utils/MongooseError";

import AppwriteError, {
  isAppwriteError,
  AppwriteErrorTypes,
} from "@utils/AppwriteError";

import ApiError, { isApiError, ApiErrorResponse } from "@utils/ApiError";

const onError: ErrorHandler = (error, ctx) => {
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
