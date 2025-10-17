import { Error, mongo } from "mongoose";

import { ContentfulStatusCode } from "hono/utils/http-status";

import { ErrorCode, status } from "@utils/ApiError";

export type MongooseErrorTypes =
  | Error.CastError
  | Error.ValidationError
  | mongo.MongoServerError;

export const isMongooseError = (error: unknown) => {
  return (
    error instanceof Error.CastError ||
    error instanceof Error.ValidationError ||
    error instanceof mongo.MongoServerError
  );
};

export default class MongooseError extends Error {
  public readonly code: ErrorCode;
  public readonly status: ContentfulStatusCode;

  constructor(error: MongooseErrorTypes) {
    if (error instanceof Error.ValidationError) {
      const instance = Object.values(error.errors)[0];

      if (instance) {
        super(instance.message);
        this.code = "VALIDATION_ERROR";
        this.status = status[this.code];
        return;
      }

      super("An Unexpected Validation Error Has Occurred");
      this.code = "VALIDATION_ERROR";
      this.status = status[this.code];
      return;
    }

    if (error instanceof Error.CastError) {
      super("A Field Has Been Assigned An Invalid Value");
      this.code = "CAST_ERROR";
      this.status = status[this.code];
      return;
    }

    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      super("A Duplicate Field Has Been Detected");
      this.code = "DUPLICATE_KEY_ERROR";
      this.status = status[this.code];
      return;
    }

    if (error instanceof mongo.MongoServerError) {
      super("An Internal Database Server Error Has Occurred");
      this.code = "DATABASE_SERVER_ERROR";
      this.status = status[this.code];
      return;
    }

    super("An Unexpected Database Server Error Has Occurred");
    this.code = "DATABASE_SERVER_ERROR";
    this.status = status[this.code];
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
    };
  }
}
