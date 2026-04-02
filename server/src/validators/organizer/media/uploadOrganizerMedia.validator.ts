import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const uploadOrganizerMediaValidatorSchema = z.strictObject(
  {
    profile: z
      .file("Profile Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Profile Image Cannot Exceed 5MB")
      .refine((file) => {
        return ["image/png", "image/jpeg"].includes(file.type);
      }, "Invalid Profile Image Type"),
    banner: z
      .file("Banner Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Banner Image Cannot Exceed 5MB")
      .refine((file) => {
        return ["image/png", "image/jpeg"].includes(file.type);
      }, "Invalid Banner Image Type"),
  },
  "Only Organizer Media Must Be Provided",
);

/**
 * A validator middleware for the organizer's profile and banner image upload requests.
 *
 * This middleware validates the request form data against the profile upload schema.
 */
const uploadOrganizerMediaValidator = validator(
  "form",
  uploadOrganizerMediaValidatorSchema,
);

/**
 * A type that represents the organizer's profile and banner image payload.
 */
export type UploadOrganizerMediaValidatorSchema = z.infer<
  typeof uploadOrganizerMediaValidatorSchema
>;

/**
 * A type that represents the Hono context with the organizer's profile and banner image data.
 */
export type UploadOrganizerMediaContext = ValidatorContext<
  typeof uploadOrganizerMediaValidator
>;

export default uploadOrganizerMediaValidator;
