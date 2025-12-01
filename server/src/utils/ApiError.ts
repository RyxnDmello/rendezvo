import { Context } from "hono";

import { ContentfulStatusCode } from "hono/utils/http-status";

import AppwriteError from "./AppwriteError";
import MongooseError from "./MongooseError";

export interface CustomError {
  error: string;
  code: ErrorCode;
}

export type CommonErrorCode =
  | "CONFLICT"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "UNPROCESSABLE_ENTITY"
  | "INTERNAL_SERVER_ERROR";

export type AuthErrorCode =
  | "FORBIDDEN"
  | "UNAUTHORIZED"
  | "ACCOUNT_LOCKED"
  | "SESSION_EXPIRED"
  | "EMAIL_NOT_VERIFIED"
  | "INVALID_CREDENTIALS"
  | "ACCESS_TOKEN_MISSING"
  | "ACCESS_TOKEN_INVALID"
  | "ACCESS_TOKEN_EXPIRED"
  | "ACCESS_TOKEN_REVOKED"
  | "REFRESH_TOKEN_MISSING"
  | "REFRESH_TOKEN_INVALID"
  | "REFRESH_TOKEN_EXPIRED"
  | "REFRESH_TOKEN_REVOKED";

export type DatabaseErrorCode =
  | "CAST_ERROR"
  | "VALIDATION_ERROR"
  | "DUPLICATE_KEY_ERROR"
  | "DATABASE_SERVER_ERROR";

export type StorageErrorCode =
  | "FILE_NOT_FOUND"
  | "INVALID_FILE_ID"
  | "INVALID_FILE_TYPE"
  | "INVALID_FILE_SIZE"
  | "FILE_UPLOAD_FAILED"
  | "FILE_ALREADY_EXISTS"
  | "STORAGE_SERVER_ERROR";

export type ErrorCode =
  | AuthErrorCode
  | CommonErrorCode
  | StorageErrorCode
  | DatabaseErrorCode;

export const status: Record<ErrorCode, ContentfulStatusCode> = {
  CONFLICT: 409,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,

  ACCOUNT_LOCKED: 403,
  SESSION_EXPIRED: 401,
  EMAIL_NOT_VERIFIED: 403,
  INVALID_CREDENTIALS: 401,

  CAST_ERROR: 400,
  VALIDATION_ERROR: 422,
  DUPLICATE_KEY_ERROR: 409,
  DATABASE_SERVER_ERROR: 500,

  ACCESS_TOKEN_MISSING: 401,
  ACCESS_TOKEN_INVALID: 401,
  ACCESS_TOKEN_EXPIRED: 401,
  ACCESS_TOKEN_REVOKED: 401,
  REFRESH_TOKEN_MISSING: 401,
  REFRESH_TOKEN_INVALID: 401,
  REFRESH_TOKEN_EXPIRED: 401,
  REFRESH_TOKEN_REVOKED: 401,

  FILE_NOT_FOUND: 404,
  INVALID_FILE_ID: 400,
  INVALID_FILE_TYPE: 400,
  INVALID_FILE_SIZE: 400,
  FILE_UPLOAD_FAILED: 400,
  FILE_ALREADY_EXISTS: 409,
  STORAGE_SERVER_ERROR: 500,
};

export const isApiError = (error: unknown) => {
  return (
    error instanceof ApiError ||
    error instanceof AppwriteError ||
    error instanceof MongooseError
  );
};

export default class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly status: ContentfulStatusCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
    this.status = status[code];
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
    };
  }
}

export const ApiErrorResponse = (ctx: Context, error: unknown) => {
  if (error instanceof ApiError) {
    return ctx.json(error.toJSON(), error.status);
  }

  if (error instanceof AppwriteError) {
    return ctx.json(error.toJSON(), error.status);
  }

  if (error instanceof MongooseError) {
    return ctx.json(error.toJSON(), error.status);
  }

  return ctx.json(
    {
      error: "An Unexpected Error Occurred",
      code: "INTERNAL_SERVER_ERROR",
    },
    500
  );
};

export const ApiErrorCustomResponse = (ctx: Context, error: CustomError) => {
  return ctx.json(error, status[error.code]);
};
