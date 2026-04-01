import { env } from "@constants/env";

import { storage, buffer } from "@config/appwrite.config";

import ApiError from "@utils/ApiError";

const { APPWRITE_STORAGE_ID } = env.APPWRITE;

/**
 * A record of image, video, and other supported file mime types and extensions.
 * When creating a file, during file uploads, this record can be used for validation.
 *
 * @example
 * const file = new File();
 *
 * const extension = EXTENSION[file.type];
 *
 * if (!extension) {
 *   throw new ApiError(
 *     "The File Provided Has An Unsupported Type",
 *     "INVALID_FILE_TYPE",
 *   );
 * }
 */
const EXTENSION: Record<string, string> = {
  "image/png": "png",
  "image/bmp": "bmp",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/tiff": "tiff",
  "image/heic": "heic",
  "image/heif": "heif",
  "video/mp4": "mp4",
  "video/ogg": "ogv",
  "video/3gpp": "3gp",
  "video/mpeg": "mpeg",
  "video/webm": "webm",
  "video/3gpp2": "3g2",
  "video/x-flv": "flv",
  "video/x-ms-wmv": "wmv",
  "video/x-msvideo": "avi",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
  "video/x-matroska": "mkv",
};

/**
 * A helper function to return an ID created from a MongoDB document ID.
 * This ID should be used when storing or accessing file objects from Appwrite.
 *
 * @param {string} id - The ID of the MongoDB document.
 *
 * @returns An ID. This ID is used for Appwrite file objects.
 *
 * @example
 * const model = await Model.findOne({});
 * const id = getID(model._id.toString());
 */
export const getID = (id: string) => {
  if (id.length > 8) {
    return id.slice(0, 4) + id.slice(-4);
  }

  return id;
};

/**
 * A helper function to return the ID of the Appwrite file object.
 *
 * @param {string} id - The unique ID of an Appwrite file object.
 *
 * @returns The Appwrite file object ID.
 *
 * @example
 * const id = "my-file";
 * return await getFile(id);
 */
export const getFile = async (id: string) => {
  const { $id } = await storage.getFile({
    fileId: id,
    bucketId: APPWRITE_STORAGE_ID,
  });

  return $id;
};

/**
 * A helper function to return the IDs of the Appwrite file objects.
 *
 * @param {string[]} queries - The queries to filter Appwrite file objects.
 *
 * @returns An array of Appwrite file object IDs.
 *
 * @example
 * import { Query } from "node-appwrite";
 *
 * const queries = [
 *   Query.startsWith("$id", "my-file")
 * ];
 *
 * return await getFiles(queries);
 */
export const getFiles = async (queries: string[]) => {
  const { files } = await storage.listFiles({
    queries,
    bucketId: APPWRITE_STORAGE_ID,
  });

  return files.map((file) => file.$id);
};

/**
 * A helper function to upload a file to Appwrite file storage.
 *
 * @param {string} id - The unique ID of an Appwrite file object to be uploaded.
 * @param {File} file - The file to be stored in Appwrite file storage.
 *
 * @returns The ID of the Appwrite file object after a successful upload.
 *
 * @example
 * const id = "my-file";
 * const file = new File();
 *
 * const $id = await uploadFile(id, file);
 */
export const uploadFile = async (id: string, file: File) => {
  const custom = await createFile(id, file);

  const { $id } = await storage.createFile({
    fileId: id,
    file: custom,
    bucketId: APPWRITE_STORAGE_ID,
  });

  return $id;
};

/**
 * A helper function to update a file in Appwrite file storage.
 * It essentially deletes the old file and uploads a new file.
 *
 * @param {string} id - The unique ID of an Appwrite file object to be updated.
 * @param {File} file - The file to be stored in place of the current file object.
 *
 * @returns The ID of the Appwrite file object after a successful update.
 *
 * @example
 * const id = "my-file";
 * const newFile = new File();
 *
 * const $id = await updateFile(id, newFile);
 */
export const updateFile = async (id: string, file: File) => {
  await deleteFile(id);
  return await uploadFile(id, file);
};

/**
 * A helper function to delete a file in Appwrite file storage.
 *
 * @param {string} id - The unique ID of an Appwrite file object to be deleted.
 *
 * @example
 * const id = "my-file";
 * await deleteFile(id);
 */
export const deleteFile = async (id: string) => {
  await storage.deleteFile({
    fileId: id,
    bucketId: APPWRITE_STORAGE_ID,
  });
};

/**
 * An internal helper function which modifies file appropriately for Appwrite file storage.
 * It renames the file and its extension metadata to make it suitable for storage.
 *
 * @param {string} id - The unique ID which will be assigned to the file.
 * @param {File} file - The file object to be created and stored with the ID.
 *
 * @returns The file with its updated name and extension, suitable for uploads.
 *
 * @throws An ApiError if the file type is not supported.
 *
 * @example
 * const id = "my-file";
 * const file = new File();
 *
 * const readyFile = await createFile(id, file);
 */
export const createFile = async (id: string, file: File) => {
  const blob = await file.arrayBuffer();

  const extension = EXTENSION[file.type];

  if (!extension) {
    throw new ApiError(
      "The File Provided Has An Unsupported Type",
      "INVALID_FILE_TYPE",
    );
  }

  const custom = new File([blob], `${id}.${extension}`, {
    type: file.type,
  });

  return buffer(custom, custom.name);
};
