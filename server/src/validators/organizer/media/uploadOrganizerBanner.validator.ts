import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const uploadOrganizerBannerValidatorSchema = z.strictObject(
  {
    banner: z
      .file("Banner Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Banner Image Cannot Exceed 5MB")
      .refine((file) => {
        return ["image/png", "image/jpeg"].includes(file.type);
      }, "Invalid Banner Image Type"),
  },
  "Only Organizer Banner Image Must Be Provided",
);

/**
 * A validator middleware for the organizer's banner image upload requests.
 *
 * This middleware validates the request form data against the banner upload schema.
 */
const uploadOrganizerBannerValidator = validator(
  "form",
  uploadOrganizerBannerValidatorSchema,
);

/**
 * A type that represents the organizer's banner image payload.
 */
export type UploadOrganizerBannerValidatorSchema = z.infer<
  typeof uploadOrganizerBannerValidatorSchema
>;

/**
 * A type that represents the Hono context with the organizer's banner image data.
 */
export type UploadOrganizerBannerContext = ValidatorContext<
  typeof uploadOrganizerBannerValidator
>;

export default uploadOrganizerBannerValidator;
