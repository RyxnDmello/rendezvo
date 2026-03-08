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

const uploadOrganizerProfileValidator = validator(
  "form",
  uploadOrganizerProfileValidatorSchema,
);

export type UploadOrganizerProfileValidatorSchema = z.infer<
  typeof uploadOrganizerProfileValidatorSchema
>;

export type UploadOrganizerProfileContext = ValidatorContext<
  typeof uploadOrganizerProfileValidator
>;

export default uploadOrganizerProfileValidator;
