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

const uploadOrganizerMediaValidator = validator(
  "form",
  uploadOrganizerMediaValidatorSchema,
);

export type UploadOrganizerMediaValidatorSchema = z.infer<
  typeof uploadOrganizerMediaValidatorSchema
>;

export type UploadOrganizerMediaContext = ValidatorContext<
  typeof uploadOrganizerMediaValidator
>;

export default uploadOrganizerMediaValidator;
