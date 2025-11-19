import { AppwriteException } from "node-appwrite";

import { ContentfulStatusCode } from "hono/utils/http-status";

import { ErrorCode, status } from "@utils/ApiError";

export type AppwriteErrorTypes = AppwriteException;

export const isAppwriteError = (error: unknown) => {
  return error instanceof AppwriteException;
};

export default class AppwriteError extends Error {
  public readonly code: ErrorCode;
  public readonly status: ContentfulStatusCode;

  constructor(error: AppwriteErrorTypes) {
    if (error.code === 400) {
      if (error.type === "storage_file_empty") {
        super("A File Must Be Provided");
        this.code = "FILE_NOT_FOUND";
        this.status = status[this.code];
        return;
      }

      if (error.type === "storage_invalid_file_size") {
        super("File Exceeds The Maximum Allowed Size");
        this.code = "INVALID_FILE_SIZE";
        this.status = status[this.code];
        return;
      }

      if (error.type === "storage_file_type_unsupported") {
        super("Invalid File Type Or Extension");
        this.code = "INVALID_FILE_TYPE";
        this.status = status[this.code];
        return;
      }

      if (error.type === "storage_invalid_content_range") {
        super("Invalid File Type Or Extension");
        this.code = "INVALID_FILE_TYPE";
        this.status = status[this.code];
        return;
      }

      if (error.type === "storage_device_not_found") {
        super("Unable To Handle File Due To Storage Error");
        this.code = "STORAGE_SERVER_ERROR";
        this.status = status[this.code];
        return;
      }

      if (error.type === "storage_invalid_appwrite_id") {
        super("Unable To Handle File Due To Server Error");
        this.code = "STORAGE_SERVER_ERROR";
        this.status = status[this.code];
        return;
      }

      super("An Unexpected Storage Error Has Occurred");
      this.code = "STORAGE_SERVER_ERROR";
      this.status = status[this.code];
      return;
    }

    if (error.code === 403) {
      super("Unauthorized Access Or Invalid File Upload");
      this.code = "INVALID_CREDENTIALS";
      this.status = status[this.code];
      return;
    }

    if (error.code === 404) {
      if (error.type === "storage_file_not_found") {
        super("Requested File Not Found In Storage");
        this.code = "FILE_NOT_FOUND";
        this.status = status[this.code];
        return;
      }

      if (error.type === "storage_bucket_not_found") {
        super("Specified Storage Bucket Not Found");
        this.code = "FILE_NOT_FOUND";
        this.status = status[this.code];
        return;
      }

      super("Requested Resource Not Found In Appwrite");
      this.code = "FILE_NOT_FOUND";
      this.status = status[this.code];
      return;
    }

    if (error.code === 409) {
      if (error.type === "storage_file_already_exists") {
        super("A File With This ID Already Exists");
        this.code = "FILE_ALREADY_EXISTS";
        this.status = status[this.code];
        return;
      }

      if (error.type === "storage_bucket_already_exists") {
        super("A Storage Bucket With This ID Already Exists");
        this.code = "STORAGE_SERVER_ERROR";
        this.status = status[this.code];
        return;
      }

      super("Storage Resource Conflict");
      this.code = "STORAGE_SERVER_ERROR";
      this.status = status[this.code];
      return;
    }

    if (error.code === 416) {
      super("Invalid Byte Range Requested For File");
      this.code = "STORAGE_SERVER_ERROR";
      this.status = status[this.code];
      return;
    }

    super("An Unexpected Appwrite Server Error Has Occurred");
    this.code = "STORAGE_SERVER_ERROR";
    this.status = status[this.code];
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
    };
  }
}
