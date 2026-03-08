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

const uploadOrganizerBannerValidator = validator(
  "form",
  uploadOrganizerBannerValidatorSchema,
);

export type UploadOrganizerBannerValidatorSchema = z.infer<
  typeof uploadOrganizerBannerValidatorSchema
>;

export type UploadOrganizerBannerContext = ValidatorContext<
  typeof uploadOrganizerBannerValidator
>;

export default uploadOrganizerBannerValidator;
