import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const TYPES = [
  "video/mp4",
  "video/ogg",
  "video/mpeg",
  "video/webm",
  "video/3gpp",
  "video/3gpp2",
  "video/x-flv",
  "video/x-ms-wmv",
  "video/x-msvideo",
  "video/quicktime",
  "video/x-matroska",
];

const uploadEventVideoValidatorSchema = z.strictObject(
  {
    video: z
      .file("Event Video Must Be A Valid Video Type")
      .max(5 * 1024 * 1024, "Event Video Cannot Exceed 5MB")
      .refine((file) => TYPES.includes(file.type), "Invalid Event Video Type"),
  },
  "Only Event Video Must Be Provided",
);

const uploadEventVideoValidator = validator(
  "form",
  uploadEventVideoValidatorSchema,
);

export type UploadEventVideoValidatorSchema = z.infer<
  typeof uploadEventVideoValidatorSchema
>;

export type UploadEventVideoContext = ValidatorContext<
  typeof uploadEventVideoValidator
>;

export default uploadEventVideoValidator;
