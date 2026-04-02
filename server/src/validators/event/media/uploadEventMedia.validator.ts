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

const uploadEventMediaValidatorSchema = z.strictObject(
  {
    cover: z
      .file("Cover Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Cover Image Cannot Exceed 5MB")
      .refine((file) => TYPES.includes(file.type), "Invalid Cover Image Type"),
    banner: z
      .file("Banner Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Banner Image Cannot Exceed 5MB")
      .refine((file) => TYPES.includes(file.type), "Invalid Banner Image Type"),
  },
  "Only Organizer Media Must Be Provided",
);

/**
 * A validator middleware for event cover and banner image upload requests.
 *
 * This middleware validates the request form data against the event cover and banner image upload schema.
 */
const uploadEventMediaValidator = validator(
  "form",
  uploadEventMediaValidatorSchema,
);

/**
 * A type that represents the validated event cover and banner image upload payload.
 */
export type UploadEventMediaValidatorSchema = z.infer<
  typeof uploadEventMediaValidatorSchema
>;

/**
 * A type that represents the Hono context with validated event cover and banner image upload data.
 */
export type UploadEventMediaContext = ValidatorContext<
  typeof uploadEventMediaValidator
>;

export default uploadEventMediaValidator;
