import { Client, Storage } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import { env } from "@constants/env";

const { APPWRITE_ID, APPWRITE_API, APPWRITE_API_KEY } = env.APPWRITE;

const appwrite = new Client();

appwrite.setProject(APPWRITE_ID);
appwrite.setKey(APPWRITE_API_KEY);
appwrite.setEndpoint(APPWRITE_API);

/**
 * A buffer function that takes a blob, a suitable name, and returns a file blob.
 *
 * When a file is requested via multipart/form-data, we can use the buffer function
 * to modify the metadata of the file, such as the name and extension of the file.
 */
export const buffer = InputFile.fromBuffer;

/**
 * An Appwrite storage instance. Use this to get, upload, update, and delete files.
 *
 * This is an instance of the Appwrite storage class. It is used in the global helper
 * storage file.
 */
export const storage = new Storage(appwrite);
