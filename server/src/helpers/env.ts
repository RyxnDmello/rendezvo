import { ZodError } from "zod";

import envValidator, {
  EnvValidatorSchema,
} from "@validators/env/env.validator";

const { ...variables } = process.env;

let env: EnvValidatorSchema;

try {
  env = envValidator({
    GLOBAL: {
      PORT: variables.DEVELOPMENT_PORT || variables.PORT,
    },
    SECRET: {
      COOKIES_SECRET: variables.COOKIES_SECRET,
      ATTENDEE_ACCESS_TOKEN_EXPIRY: variables.ATTENDEE_ACCESS_TOKEN_EXPIRY,
      ATTENDEE_REFRESH_TOKEN_EXPIRY: variables.ATTENDEE_REFRESH_TOKEN_EXPIRY,
      ATTENDEE_ACCESS_TOKEN_SECRET: variables.ATTENDEE_ACCESS_TOKEN_SECRET,
      ATTENDEE_REFRESH_TOKEN_SECRET: variables.ATTENDEE_REFRESH_TOKEN_SECRET,
      ORGANIZER_ACCESS_TOKEN_EXPIRY: variables.ORGANIZER_ACCESS_TOKEN_EXPIRY,
      ORGANIZER_REFRESH_TOKEN_EXPIRY: variables.ORGANIZER_REFRESH_TOKEN_EXPIRY,
      ORGANIZER_ACCESS_TOKEN_SECRET: variables.ORGANIZER_ACCESS_TOKEN_SECRET,
      ORGANIZER_REFRESH_TOKEN_SECRET: variables.ORGANIZER_REFRESH_TOKEN_SECRET,
    },
    MONGODB: {
      MONGODB_DB: variables.MONGODB_DB,
      MONGODB_APP: variables.MONGODB_APP,
      MONGODB_URI: variables.MONGODB_URI,
    },
  });
} catch (error) {
  if (error instanceof ZodError) {
    console.log("\n", error.issues[0]?.message, "\n");
  }

  process.exit(0);
}

export { env };
