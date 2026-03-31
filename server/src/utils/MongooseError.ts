import { Error, mongo } from "mongoose";

import ApiError from "@utils/ApiError";

export type MongooseErrorTypes =
  | Error.CastError
  | Error.ValidationError
  | mongo.MongoServerError;

export const isMongooseError = (error: unknown) => {
  return Boolean(
    error instanceof Error.CastError ||
    error instanceof Error.ValidationError ||
    error instanceof mongo.MongoServerError,
  );
};

export default class MongooseError extends ApiError {
  constructor(error: MongooseErrorTypes) {
    if (error instanceof Error.ValidationError) {
      const instance = Object.values(error.errors)[0];

      if (instance) {
        super(instance.message, "VALIDATION_ERROR");
        return;
      }

      super("An Unexpected Validation Error Has Occurred", "VALIDATION_ERROR");
      return;
    }

    if (error instanceof Error.CastError) {
      super("A Field Has Been Assigned An Invalid Value", "CAST_ERROR");
      return;
    }

    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      super("A Duplicate Field Has Been Detected", "DUPLICATE_KEY_ERROR");
      return;
    }

    if (error instanceof mongo.MongoServerError) {
      super(
        "An Internal Database Server Error Has Occurred",
        "DATABASE_SERVER_ERROR",
      );

      return;
    }

    super(
      "An Unexpected Database Server Error Has Occurred",
      "DATABASE_SERVER_ERROR",
    );
  }
}
