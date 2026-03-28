import * as z from "zod";

const globalValidatorSchema = z.strictObject(
  {
    PORT: z.coerce
      .number("Port Must Be A Valid Number")
      .min(3000, "Port Must Be Between 3000 And 9999")
      .max(9999, "Port Must Be Between 3000 And 9999")
      .default(8080),
  },
  "Global Environment Variables Are Missing",
);

const secretValidatorSchema = z.strictObject(
  {
    COOKIES_SECRET: z
      .string("Cookies Secret Must Be A Valid Secret")
      .min(32, "Cookies Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Cookies Secret Must Be A Maximum Of 64 Characters"),
    USER_ACCESS_TOKEN_ISSUER: z
      .string("Access Token Issuer Must Be A Valid Secret")
      .min(32, "Access Token Issuer Must Be A Minimum Of 32 Characters")
      .max(64, "Access Token Issuer Must Be A Maximum Of 64 Characters"),
    USER_ACCESS_TOKEN_SECRET: z
      .string("Access Token Secret Must Be A Valid Secret")
      .min(32, "Access Token Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Access Token Secret Must Be A Maximum Of 64 Characters"),
    USER_ACCESS_TOKEN_EXPIRY: z.coerce
      .number("Access Token Expiry Must Be Set In Minutes")
      .min(15, "Access Token Expiry Must Be At Least 15 Minutes")
      .max(30, "Access Token Expiry Must Be At Most 30 Minutes"),
    USER_REFRESH_TOKEN_ISSUER: z
      .string("Refresh Token Issuer Must Be A Valid Secret")
      .min(32, "Refresh Token Issuer Must Be A Minimum Of 32 Characters")
      .max(64, "Refresh Token Issuer Must Be A Maximum Of 64 Characters"),
    USER_REFRESH_TOKEN_SECRET: z
      .string("Refresh Token Secret Must Be A Valid Secret")
      .min(32, "Refresh Token Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Refresh Token Secret Must Be A Maximum Of 64 Characters"),
    USER_REFRESH_TOKEN_EXPIRY: z.coerce
      .number("Refresh Token Expiry Must Be Set In Minutes")
      .min(60 * 24 * 7, "Refresh Token Expiry Must Be At Least 7 Days")
      .max(60 * 24 * 14, "Refresh Token Expiry Must Be At Most 14 Days"),
    ORGANIZER_ACCESS_TOKEN_ISSUER: z
      .string("Access Token Issuer Must Be A Valid Secret")
      .min(32, "Access Token Issuer Must Be A Minimum Of 32 Characters")
      .max(64, "Access Token Issuer Must Be A Maximum Of 64 Characters"),
    ORGANIZER_ACCESS_TOKEN_SECRET: z
      .string("Access Token Secret Must Be A Valid Secret")
      .min(32, "Access Token Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Access Token Secret Must Be A Maximum Of 64 Characters"),
    ORGANIZER_ACCESS_TOKEN_EXPIRY: z.coerce
      .number("Access Token Expiry Must Be Set In Minutes")
      .min(30, "Access Token Expiry Must Be At Least 30 Minutes")
      .max(60, "Access Token Expiry Must Be At Most 1 Hour"),
    ORGANIZER_REFRESH_TOKEN_ISSUER: z
      .string("Refresh Token Issuer Must Be A Valid Secret")
      .min(32, "Refresh Token Issuer Must Be A Minimum Of 32 Characters")
      .max(64, "Refresh Token Issuer Must Be A Maximum Of 64 Characters"),
    ORGANIZER_REFRESH_TOKEN_SECRET: z
      .string("Refresh Token Secret Must Be A Valid Secret")
      .min(32, "Refresh Token Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Refresh Token Secret Must Be A Maximum Of 64 Characters"),
    ORGANIZER_REFRESH_TOKEN_EXPIRY: z.coerce
      .number("Refresh Token Expiry Must Be Set In Minutes")
      .min(60 * 24 * 14, "Refresh Token Expiry Must Be At Least 14 Days")
      .max(60 * 24 * 28, "Refresh Token Expiry Must Be At Most 28 Days"),
  },
  "Secret Environment Variables Are Missing",
);

const redisValidatorSchema = z.strictObject(
  {
    REDIS_PORT: z.coerce
      .number("Redis Port Must Be A Valid Number")
      .min(3000, "Redis Port Must Be Between 3000 And 9999")
      .max(9999, "Redis Port Must Be Between 3000 And 9999")
      .default(6379),
    REDIS_HOST: z.string("Redis Host Must Be A Valid Host"),
    REDIS_USERNAME: z.string("Redis Username Must Be A Valid Username"),
    REDIS_PASSWORD: z.string("Redis Password Must Be A Valid Password"),
  },
  "Redis Environment Variables Are Missing",
);

const mongodbValidatorSchema = z.strictObject(
  {
    MONGODB_URI: z.string("MongoDB URI Must Be A Valid URI"),
    MONGODB_APP: z.string("MongoDB App Must Be A Valid App"),
    MONGODB_DATABASE: z.string("MongoDB Database Must Be A Valid Database"),
  },
  "MongoDB Environment Variables Are Missing",
);

const appwriteValidatorSchema = z.strictObject(
  {
    APPWRITE_ID: z.string("Appwrite ID Must Be A Valid ID"),
    APPWRITE_API: z.string("Appwrite API Must Be A Valid API"),
    APPWRITE_API_KEY: z.string("Appwrite API Key Must Be A Valid API Key"),
    APPWRITE_STORAGE_ID: z.string("Appwrite Storage ID Must Be A Valid ID"),
  },
  "MongoDB Environment Variables Are Missing",
);

const envValidatorSchema = z
  .strictObject(
    {
      GLOBAL: globalValidatorSchema,
      SECRET: secretValidatorSchema,
      REDIS: redisValidatorSchema,
      MONGODB: mongodbValidatorSchema,
      APPWRITE: appwriteValidatorSchema,
    },
    "Environment Variables Are Missing",
  )
  .superRefine((values, ctx) => {
    const {
      COOKIES_SECRET,
      USER_ACCESS_TOKEN_ISSUER,
      USER_ACCESS_TOKEN_SECRET,
      USER_REFRESH_TOKEN_ISSUER,
      USER_REFRESH_TOKEN_SECRET,
      ORGANIZER_ACCESS_TOKEN_ISSUER,
      ORGANIZER_ACCESS_TOKEN_SECRET,
      ORGANIZER_REFRESH_TOKEN_ISSUER,
      ORGANIZER_REFRESH_TOKEN_SECRET,
    } = values.SECRET;

    const secrets = [
      COOKIES_SECRET,
      USER_ACCESS_TOKEN_ISSUER,
      USER_ACCESS_TOKEN_SECRET,
      USER_REFRESH_TOKEN_ISSUER,
      USER_REFRESH_TOKEN_SECRET,
      ORGANIZER_ACCESS_TOKEN_ISSUER,
      ORGANIZER_ACCESS_TOKEN_SECRET,
      ORGANIZER_REFRESH_TOKEN_ISSUER,
      ORGANIZER_REFRESH_TOKEN_SECRET,
    ];

    if (secrets.length !== new Set(secrets).size) {
      return ctx.addIssue({
        code: "custom",
        message: "Every Secret Must Be Unique",
      });
    }
  });

const envValidator = (variables: Record<string, unknown>) => {
  return envValidatorSchema.parse(variables);
};

export type EnvValidatorSchema = z.infer<typeof envValidatorSchema>;

export default envValidator;
