import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const updateOrganizerMediaValidatorSchema = z.strictObject(
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
  "Only Organizer Media Must Be Provided"
);

const updateOrganizerMediaValidator = validator(
  "form",
  updateOrganizerMediaValidatorSchema
);

export type UpdateOrganizerMediaValidatorSchema = z.infer<
  typeof updateOrganizerMediaValidatorSchema
>;

export type UpdateOrganizerMediaContext = ValidatorContext<
  typeof updateOrganizerMediaValidator
>;

export default updateOrganizerMediaValidator;
