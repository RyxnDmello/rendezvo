import { Client, Storage } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import { env } from "@constants/env";

const { APPWRITE_ID, APPWRITE_API, APPWRITE_API_KEY } = env.APPWRITE;

const appwrite = new Client();

appwrite.setProject(APPWRITE_ID);
appwrite.setKey(APPWRITE_API_KEY);
appwrite.setEndpoint(APPWRITE_API);

export const buffer = InputFile.fromBuffer;

export const storage = new Storage(appwrite);
