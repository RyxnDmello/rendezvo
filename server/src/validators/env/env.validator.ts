import * as z from "zod";

const globalValidatorSchema = z.strictObject(
  {
    PORT: z.coerce
      .number("Port Must Be A Valid Number")
      .min(3000, "Port Must Be Between 3000 And 9999")
      .max(9999, "Port Must Be Between 3000 And 9999")
      .default(8080),
  },
  "Global Environment Variables Are Missing"
);

const secretValidatorSchema = z.strictObject(
  {
    COOKIES_SECRET: z
      .string("Cookie Secret Must Be A Valid String")
      .min(32, "Cookie Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Cookie Secret Must Be A Maximum Of 64 Characters"),
    ATTENDEE_ACCESS_TOKEN_EXPIRY: z.coerce
      .number("Access Token Expiry Must Be Set In Minutes")
      .min(15, "Access Token Expiry Must Be At Least 15 Minutes")
      .max(30, "Access Token Expiry Must Be At Most 30 Minutes"),
    ATTENDEE_REFRESH_TOKEN_EXPIRY: z.coerce
      .number("Refresh Token Expiry Must Be Set In Minutes")
      .min(60 * 24 * 7, "Refresh Token Expiry Must Be At Least 7 Days")
      .max(60 * 24 * 14, "Refresh Token Expiry Must Be At Most 14 Days"),
    ATTENDEE_ACCESS_TOKEN_SECRET: z
      .string("Access Token Secret Must Be A Valid String")
      .min(32, "Access Token Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Access Token Secret Must Be A Maximum Of 64 Characters"),
    ATTENDEE_REFRESH_TOKEN_SECRET: z
      .string("Refresh Token Secret Must Be A Valid String")
      .min(32, "Refresh Token Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Refresh Token Secret Must Be A Maximum Of 64 Characters"),
    ORGANIZER_ACCESS_TOKEN_EXPIRY: z.coerce
      .number("Access Token Expiry Must Be Set In Minutes")
      .min(30, "Access Token Expiry Must Be At Least 30 Minutes")
      .max(60, "Access Token Expiry Must Be At Most 1 Hour"),
    ORGANIZER_REFRESH_TOKEN_EXPIRY: z.coerce
      .number("Refresh Token Expiry Must Be Set In Minutes")
      .min(60 * 24 * 14, "Refresh Token Expiry Must Be At Least 14 Days")
      .max(60 * 24 * 28, "Refresh Token Expiry Must Be At Most 28 Days"),
    ORGANIZER_ACCESS_TOKEN_SECRET: z
      .string("Access Token Secret Must Be A Valid String")
      .min(32, "Access Token Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Access Token Secret Must Be A Maximum Of 64 Characters"),
    ORGANIZER_REFRESH_TOKEN_SECRET: z
      .string("Refresh Token Secret Must Be A Valid String")
      .min(32, "Refresh Token Secret Must Be A Minimum Of 32 Characters")
      .max(64, "Refresh Token Secret Must Be A Maximum Of 64 Characters"),
  },
  "Secret Environment Variables Are Missing"
);

const mongodbValidatorSchema = z.strictObject(
  {
    MONGODB_URI: z
      .string("MongoDB URI Must Be A Valid String")
      .regex(
        /^mongodb(?:\+srv)?:\/\/[^:@\s]+:[^:@\s]+@[^:@\s]+(:\d+)?(\/\S*)?$/i,
        "MongoDB URI Must Be A Valid MongoDB Connection URI"
      ),
    MONGODB_DB: z
      .string("MongoDB Database Must Be A Valid String")
      .regex(
        /^[a-zA-Z0-9-_]+$/,
        "MongoDB Database Must Contain Only Letters, Numbers, Dashes, Or Underscores"
      ),
    MONGODB_APP: z
      .string("MongoDB App Must Be A Valid String")
      .regex(
        /^[a-zA-Z0-9-_]+$/,
        "MongoDB App Must Contain Only Letters, Numbers, Dashes, Or Underscores"
      ),
  },
  "MongoDB Environment Variables Are Missing"
);

const envValidatorSchema = z
  .strictObject(
    {
      GLOBAL: globalValidatorSchema,
      SECRET: secretValidatorSchema,
      MONGODB: mongodbValidatorSchema,
    },
    "Environment Variables Are Missing"
  )
  .superRefine((values, ctx) => {
    const {
      COOKIES_SECRET,
      ATTENDEE_ACCESS_TOKEN_SECRET,
      ATTENDEE_REFRESH_TOKEN_SECRET,
      ORGANIZER_ACCESS_TOKEN_SECRET,
      ORGANIZER_REFRESH_TOKEN_SECRET,
    } = values.SECRET;

    const secrets = [
      COOKIES_SECRET,
      ATTENDEE_ACCESS_TOKEN_SECRET,
      ATTENDEE_REFRESH_TOKEN_SECRET,
      ORGANIZER_ACCESS_TOKEN_SECRET,
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
