import { AppwriteException } from "node-appwrite";

import ApiError from "@utils/ApiError";

/**
 * A type that represents common Appwrite error types.
 *
 * This type includes errors thrown by the Appwrite SDK.
 */
export type AppwriteErrorTypes = AppwriteException;

/**
 * A helper function that checks if an error is an AppwriteError.
 *
 * @param {unknown} error - The error to be checked.
 *
 * @returns True if the error is an AppwriteError, otherwise false.
 */
export const isAppwriteError = (error: unknown) => {
  return Boolean(error instanceof AppwriteException);
};

/**
 * A class that represents an Appwrite API error.
 *
 * This class extends the ApiError class and converts Appwrite errors into
 * standardized API errors with meaningful messages and error codes.
 *
 * @example
 * throw new AppwriteError(error as AppwriteErrorTypes);
 */
export default class AppwriteError extends ApiError {
  /**
   * A constructor that creates a new API error.
   *
   * @param {AppwriteErrorTypes} error - The original Appwrite error.
   *
   * @example
   * throw new AppwriteError(error as AppwriteErrorTypes);
   */
  constructor(error: AppwriteErrorTypes) {
    if (error.code === 400) {
      if (error.type === "storage_file_empty") {
        super("A File Must Be Provided", "FILE_NOT_FOUND");
        return;
      }

      if (error.type === "storage_invalid_file_size") {
        super("File Exceeds The Maximum Allowed Size", "INVALID_FILE_SIZE");
        return;
      }

      if (error.type === "storage_file_type_unsupported") {
        super("Invalid File Type Or Extension", "INVALID_FILE_TYPE");
        return;
      }

      if (error.type === "storage_invalid_content_range") {
        super("Invalid File Type Or Extension", "INVALID_FILE_TYPE");
        return;
      }

      if (error.type === "storage_device_not_found") {
        super(
          "Unable To Handle File Due To Storage Error",
          "STORAGE_SERVER_ERROR",
        );

        return;
      }

      if (error.type === "storage_invalid_appwrite_id") {
        super(
          "Unable To Handle File Due To Server Error",
          "STORAGE_SERVER_ERROR",
        );

        return;
      }

      super("An Unexpected Storage Error Has Occurred", "STORAGE_SERVER_ERROR");
      return;
    }

    if (error.code === 403) {
      super(
        "Unauthorized Access Or Invalid File Upload",
        "INVALID_CREDENTIALS",
      );

      return;
    }

    if (error.code === 404) {
      if (error.type === "storage_file_not_found") {
        super("Requested File Not Found In Storage", "FILE_NOT_FOUND");
        return;
      }

      if (error.type === "storage_bucket_not_found") {
        super("Specified Storage Bucket Not Found", "FILE_NOT_FOUND");
        return;
      }

      super("Requested Resource Not Found In Appwrite", "FILE_NOT_FOUND");
      return;
    }

    if (error.code === 409) {
      if (error.type === "storage_file_already_exists") {
        super("A File With This ID Already Exists", "FILE_ALREADY_EXISTS");
        return;
      }

      if (error.type === "storage_bucket_already_exists") {
        super(
          "A Storage Bucket With This ID Already Exists",
          "STORAGE_SERVER_ERROR",
        );

        return;
      }

      super("Storage Resource Conflict", "STORAGE_SERVER_ERROR");
      return;
    }

    if (error.code === 416) {
      super("Invalid Byte Range Requested For File", "STORAGE_SERVER_ERROR");
      return;
    }

    super(
      "An Unexpected Appwrite Server Error Has Occurred",
      "STORAGE_SERVER_ERROR",
    );
  }
}
