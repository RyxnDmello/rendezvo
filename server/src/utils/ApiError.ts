import { Context } from "hono";

import { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * An interface that represents a custom error message structure.
 *
 * This interface is used within the exception class, ApiError, and
 * every other exception class that extends it. The goal is to have
 * a unified structure for error responses. Every error returned by
 * the server must describe a useful message and an error code.
 */
export interface CustomError {
  error: string;
  code: ErrorCode;
}

/**
 * A type that represents common error codes.
 *
 * This type describes common error codes thrown by every server.
 */
export type CommonErrorCode =
  | "CONFLICT"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "UNPROCESSABLE_ENTITY"
  | "INTERNAL_SERVER_ERROR";

/**
 * A type that represents authentication error codes.
 *
 * This type describes error codes thrown during authentication and authorization.
 */
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

/**
 * A type that represents common database error codes.
 *
 * This type describes error codes thrown during common database operations.
 */
export type DatabaseErrorCode =
  | "CAST_ERROR"
  | "VALIDATION_ERROR"
  | "DUPLICATE_KEY_ERROR"
  | "DATABASE_SERVER_ERROR";

/**
 * A type that represents common file storage error codes.
 *
 * This type describes error codes thrown during common file storage operations.
 */
export type StorageErrorCode =
  | "FILE_NOT_FOUND"
  | "INVALID_FILE_ID"
  | "INVALID_FILE_TYPE"
  | "INVALID_FILE_SIZE"
  | "FILE_UPLOAD_FAILED"
  | "FILE_ALREADY_EXISTS"
  | "STORAGE_SERVER_ERROR";

/**
 * A type that represents error codes.
 *
 * This type describes error codes thrown by the server during operations
 * such as authentication, authorization, database, file storage, and basic
 * operations handled by most servers.
 */
export type ErrorCode =
  | AuthErrorCode
  | CommonErrorCode
  | StorageErrorCode
  | DatabaseErrorCode;

/**
 * A record that maps error codes to HTTP status codes.
 *
 * This record describes various error codes and their equivalent HTTP status
 * codes that the server responds with when an error is caught and thrown.
 */
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

/**
 * A helper function that checks if an error is an ApiError.
 *
 * @param {unknown} error - The error to be checked.
 *
 * @returns True if the error is an ApiError, otherwise false.
 */
export const isApiError = (error: unknown) => {
  return Boolean(error instanceof ApiError);
};

/**
 * A class that represents a custom API error.
 *
 * This class extends the native Error class and provides extra metadata such as
 * an error code and status. When an operation fails, we can use the ApiError to
 * return a structured error response.
 *
 * @example
 * throw new ApiError("Useful Message", "INTERNAL_SERVER_ERROR");
 */
export default class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly status: ContentfulStatusCode;

  /**
   * A constructor that creates a new API error.
   *
   * @param {string} message - A useful error message.
   * @param {ErrorCode} code - A useful error code.
   *
   * @example
   * throw new ApiError("Useful Message", "INTERNAL_SERVER_ERROR");
   */
  constructor(message: string, code: ErrorCode) {
    super(message, {
      cause: message,
    });

    this.code = code;
    this.status = status[code];
  }

  /**
   * Converts the error into a JSON response.
   *
   * @returns Serialized error object.
   */
  toJSON() {
    return {
      error: this.message,
      code: this.code,
    };
  }
}

/**
 * A helper function that returns a standardized API error response.
 *
 * @param {Context} ctx - A hono context.
 * @param {CustomError} error - The error to be returned in the response.
 *
 * @returns A JSON response containing the error details.
 *
 * @example
 * return ApiErrorResponse(ctx, {
 *   error: "Useful Message",
 *   code: "INTERNAL_SERVER_ERROR",
 * });
 */
export const ApiErrorResponse = (ctx: Context, error: CustomError) => {
  return ctx.json(error, status[error.code]);
};
