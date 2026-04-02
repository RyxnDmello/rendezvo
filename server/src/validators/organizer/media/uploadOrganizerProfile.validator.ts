import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const uploadOrganizerProfileValidatorSchema = z.strictObject(
  {
    profile: z
      .file("Profile Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Profile Image Cannot Exceed 5MB")
      .refine((file) => {
        return ["image/png", "image/jpeg"].includes(file.type);
      }, "Invalid Profile Image Type"),
  },
  "Only Organizer Profile Image Must Be Provided",
);

/**
 * A validator middleware for the organizer's profile image upload requests.
 *
 * This middleware validates the request form data against the profile upload schema.
 */
const uploadOrganizerProfileValidator = validator(
  "form",
  uploadOrganizerProfileValidatorSchema,
);

/**
 * A type that represents the organizer's profile image payload.
 */
export type UploadOrganizerProfileValidatorSchema = z.infer<
  typeof uploadOrganizerProfileValidatorSchema
>;

/**
 * A type that represents the Hono context with the organizer's profile image data.
 */
export type UploadOrganizerProfileContext = ValidatorContext<
  typeof uploadOrganizerProfileValidator
>;

export default uploadOrganizerProfileValidator;
