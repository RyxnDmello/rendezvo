import { ZodError } from "zod";

import envValidator, {
  EnvValidatorSchema,
} from "@validators/env/env.validator";

const { ...variables } = process.env;

/**
 * A global constant that holds all the environment variables.
 */
let env: EnvValidatorSchema;

try {
  env = envValidator({
    GLOBAL: {
      PORT: variables.DEVELOPMENT_PORT || variables.PORT,
    },
    SECRET: {
      COOKIES_SECRET: variables.COOKIES_SECRET,
      USER_ACCESS_TOKEN_ISSUER: variables.USER_ACCESS_TOKEN_ISSUER,
      USER_ACCESS_TOKEN_SECRET: variables.USER_ACCESS_TOKEN_SECRET,
      USER_ACCESS_TOKEN_EXPIRY: variables.USER_ACCESS_TOKEN_EXPIRY,
      USER_REFRESH_TOKEN_ISSUER: variables.USER_REFRESH_TOKEN_ISSUER,
      USER_REFRESH_TOKEN_SECRET: variables.USER_REFRESH_TOKEN_SECRET,
      USER_REFRESH_TOKEN_EXPIRY: variables.USER_REFRESH_TOKEN_EXPIRY,
      ORGANIZER_ACCESS_TOKEN_ISSUER: variables.ORGANIZER_ACCESS_TOKEN_ISSUER,
      ORGANIZER_ACCESS_TOKEN_SECRET: variables.ORGANIZER_ACCESS_TOKEN_SECRET,
      ORGANIZER_ACCESS_TOKEN_EXPIRY: variables.ORGANIZER_ACCESS_TOKEN_EXPIRY,
      ORGANIZER_REFRESH_TOKEN_ISSUER: variables.ORGANIZER_REFRESH_TOKEN_ISSUER,
      ORGANIZER_REFRESH_TOKEN_SECRET: variables.ORGANIZER_REFRESH_TOKEN_SECRET,
      ORGANIZER_REFRESH_TOKEN_EXPIRY: variables.ORGANIZER_REFRESH_TOKEN_EXPIRY,
    },
    REDIS: {
      REDIS_PORT: variables.REDIS_PORT,
      REDIS_HOST: variables.REDIS_HOST,
      REDIS_USERNAME: variables.REDIS_USERNAME,
      REDIS_PASSWORD: variables.REDIS_PASSWORD,
    },
    MONGODB: {
      MONGODB_URI: variables.MONGODB_URI,
      MONGODB_APP: variables.MONGODB_APP,
      MONGODB_DATABASE: variables.MONGODB_DATABASE,
    },
    APPWRITE: {
      APPWRITE_ID: variables.APPWRITE_ID,
      APPWRITE_API: variables.APPWRITE_API,
      APPWRITE_API_KEY: variables.APPWRITE_API_KEY,
      APPWRITE_STORAGE_ID: variables.APPWRITE_STORAGE_ID,
    },
  });
} catch (error) {
  if (error instanceof ZodError) {
    console.log("\n", error.issues[0]?.message, "\n");
  }

  process.exit(0);
}

export { env };
