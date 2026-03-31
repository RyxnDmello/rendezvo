import { env } from "@constants/env";

import { storage, buffer } from "@config/appwrite.config";

const { APPWRITE_STORAGE_ID } = env.APPWRITE;

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

export const getID = (id: string) => {
  if (id.length > 8) {
    return id.slice(0, 4) + id.slice(-4);
  }

  return id;
};

export const getFile = async (id: string) => {
  const { $id } = await storage.getFile({
    fileId: id,
    bucketId: APPWRITE_STORAGE_ID,
  });

  return $id;
};

export const getFiles = async (queries: string[]) => {
  const { files } = await storage.listFiles({
    queries,
    bucketId: APPWRITE_STORAGE_ID,
  });

  return files.map((file) => file.$id);
};

export const uploadFile = async (id: string, file: File) => {
  const custom = await createFile(id, file);

  const { $id } = await storage.createFile({
    fileId: id,
    file: custom,
    bucketId: APPWRITE_STORAGE_ID,
  });

  return $id;
};

export const updateFile = async (id: string, file: File) => {
  await deleteFile(id);
  return await uploadFile(id, file);
};

export const deleteFile = async (id: string) => {
  await storage.deleteFile({
    fileId: id,
    bucketId: APPWRITE_STORAGE_ID,
  });
};

export const createFile = async (id: string, file: File) => {
  const blob = await file.arrayBuffer();

  const extension = EXTENSION[file.type]!;

  const custom = new File([blob], `${id}.${extension}`, {
    type: file.type,
  });

  return buffer(custom, custom.name);
};
