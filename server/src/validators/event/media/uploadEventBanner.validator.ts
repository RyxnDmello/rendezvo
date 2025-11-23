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

const uploadEventBannerValidatorSchema = z.strictObject(
  {
    banner: z
      .file("Banner Image Must Be A Valid Image Type")
      .max(5 * 1024 * 1024, "Banner Image Cannot Exceed 5MB")
      .refine((file) => TYPES.includes(file.type), "Invalid Banner Image Type"),
  },
  "Only Event Banner Image Must Be Provided"
);

const uploadEventBannerValidator = validator(
  "form",
  uploadEventBannerValidatorSchema
);

export type UploadEventBannerValidatorSchema = z.infer<
  typeof uploadEventBannerValidatorSchema
>;

export type UploadEventBannerContext = ValidatorContext<
  typeof uploadEventBannerValidator
>;

export default uploadEventBannerValidator;
