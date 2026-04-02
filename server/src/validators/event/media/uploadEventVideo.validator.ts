import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const TYPES = [
  "video/mp4",
  "video/ogg",
  "video/mpeg",
  "video/webm",
  "video/3gpp",
  "video/3gpp2",
  "video/x-flv",
  "video/x-ms-wmv",
  "video/x-msvideo",
  "video/quicktime",
  "video/x-matroska",
];

const uploadEventVideoValidatorSchema = z.strictObject(
  {
    video: z
      .file("Event Video Must Be A Valid Video Type")
      .max(5 * 1024 * 1024, "Event Video Cannot Exceed 5MB")
      .refine((file) => TYPES.includes(file.type), "Invalid Event Video Type"),
  },
  "Only Event Video Must Be Provided",
);

/**
 * A validator middleware for event video upload requests.
 *
 * This middleware validates the request form data against the event video upload schema.
 */
const uploadEventVideoValidator = validator(
  "form",
  uploadEventVideoValidatorSchema,
);

/**
 * A type that represents the validated event video upload payload.
 */
export type UploadEventVideoValidatorSchema = z.infer<
  typeof uploadEventVideoValidatorSchema
>;

/**
 * A type that represents the Hono context with validated event video upload data.
 */
export type UploadEventVideoContext = ValidatorContext<
  typeof uploadEventVideoValidator
>;

export default uploadEventVideoValidator;
