import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const TYPES = [
  "image/png",
  "image/jpg",
  "image/bmp",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/tiff",
  "image/heic",
  "image/heif",
];

const uploadEventCoverValidatorSchema = z.strictObject(
  {
    cover: z
      .file("Cover Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Cover Image Cannot Exceed 5MB")
      .refine((file) => TYPES.includes(file.type), "Invalid Cover Image Type"),
  },
  "Only Event Cover Image Must Be Provided",
);

/**
 * A validator middleware for event cover image upload requests.
 *
 * This middleware validates the request form data against the event cover image upload schema.
 */
const uploadEventCoverValidator = validator(
  "form",
  uploadEventCoverValidatorSchema,
);

/**
 * A type that represents the validated event cover image upload payload.
 */
export type UploadEventCoverValidatorSchema = z.infer<
  typeof uploadEventCoverValidatorSchema
>;

/**
 * A type that represents the Hono context with validated event cover image upload data.
 */
export type UploadEventCoverContext = ValidatorContext<
  typeof uploadEventCoverValidator
>;

export default uploadEventCoverValidator;
