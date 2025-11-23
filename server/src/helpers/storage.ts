import { storage, buffer } from "@services/appwrite.service";

import { env } from "@constants/env";

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

export const getFile = async (name: string) => {
  const { $id } = await storage.getFile({
    fileId: name,
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

export const uploadFile = async (file: File, name: string) => {
  const custom = await createFile(file, name);

  const { $id } = await storage.createFile({
    file: custom,
    fileId: name,
    bucketId: APPWRITE_STORAGE_ID,
  });

  return $id;
};

export const updateFile = async (file: File, name: string) => {
  await deleteFile(name);
  return await uploadFile(file, name);
};

export const deleteFile = async (id: string) => {
  await storage.deleteFile({
    fileId: id,
    bucketId: APPWRITE_STORAGE_ID,
  });
};

export const createFile = async (file: File, name: string) => {
  const blob = await file.arrayBuffer();

  const extension = EXTENSION[file.type]!;

  const custom = new File([blob], `${name}.${extension}`, {
    type: file.type,
  });

  return buffer(custom, custom.name);
};
