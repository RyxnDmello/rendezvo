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

const uploadEventImageValidatorSchema = z.strictObject(
  {
    image: z
      .file("Event Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Event Image Cannot Exceed 5MB")
      .refine((file) => TYPES.includes(file.type), "Invalid Event Image Type"),
  },
  "Only Event Image Must Be Provided",
);

/**
 * A validator middleware for event image upload requests.
 *
 * This middleware validates the request form data against the event image upload schema.
 */
const uploadEventImageValidator = validator(
  "form",
  uploadEventImageValidatorSchema,
);

/**
 * A type that represents the validated event image upload payload.
 */
export type UploadEventImageValidatorSchema = z.infer<
  typeof uploadEventImageValidatorSchema
>;

/**
 * A type that represents the Hono context with validated event image upload data.
 */
export type UploadEventImageContext = ValidatorContext<
  typeof uploadEventImageValidator
>;

export default uploadEventImageValidator;
