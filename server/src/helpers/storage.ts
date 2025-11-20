import { storage, buffer } from "@services/appwrite.service";

import { env } from "@constants/env";

const { APPWRITE_STORAGE_ID } = env.APPWRITE;

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

const createFile = async (file: File, name: string) => {
  const blob = await file.arrayBuffer();

  const extension = file.name.split(".")[1];

  const custom = new File([blob], `${name}.${extension}`, {
    type: file.type,
  });

  return buffer(custom, custom.name);
};
