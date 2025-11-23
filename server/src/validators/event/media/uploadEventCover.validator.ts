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
  "Only Event Cover Image Must Be Provided"
);

const uploadEventCoverValidator = validator(
  "form",
  uploadEventCoverValidatorSchema
);

export type UploadEventCoverValidatorSchema = z.infer<
  typeof uploadEventCoverValidatorSchema
>;

export type UploadEventCoverContext = ValidatorContext<
  typeof uploadEventCoverValidator
>;

export default uploadEventCoverValidator;
