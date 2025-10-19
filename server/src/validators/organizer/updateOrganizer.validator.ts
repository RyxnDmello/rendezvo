import * as z from "zod";

import validator from "@middlewares/validator.middleware";

const profileValidatorSchema = z.strictObject(
  {
    bio: z
      .string("Bio Must Be A String")
      .min(4, "Bio Must Be A Minimum Of 4 Characters")
      .max(250, "Bio Must Be A Maximum Of 250 Characters")
      .trim()
      .optional(),
    website: z
      .url("Website URL Must Be A Valid URL")
      .min(4, "Website URL Must Be A Minimum Of 4 Characters")
      .max(250, "Website URL Must Be A Maximum Of 250 Characters")
      .lowercase("Website URL Must Be Lowercase")
      .trim()
      .optional(),
    socials: z
      .array(
        z.object({
          url: z.string("Socials URL Must Be A Valid URL").trim().nonoptional(),
          name: z
            .string("Socials Name Must Be A Valid Platform")
            .min(4, "Socials Name Must Be A Minimum Of 4 Characters")
            .max(20, "Socials Name Must Be A Maximum Of 20 Characters")
            .regex(
              /^[A-Za-z\s]+$/,
              "Socials Name Must Contain Only Letters And Spaces"
            )
            .trim()
            .nonoptional(),
        })
      )
      .min(1, "A Minimum Of 1 Socials Must Be Provided")
      .max(5, "A Maximum Of 5 Socials Must Be Provided")
      .optional(),
  },
  "Invalid Or Unsupported Profile Properties Provided"
);

const billingValidatorSchema = z.strictObject(
  {
    bankName: z
      .string("Bank Name Must Be A String")
      .min(4, "Bank Name Must Be A Minimum Of 4 Characters")
      .max(50, "Bank Name Must Be A Maximum Of 50 Characters")
      .regex(/^[A-Za-z\s]+$/, "Bank Name Must Contain Only Letters And Spaces")
      .optional(),
    bankBranch: z
      .string("Bank Branch Must Be A String")
      .min(4, "Bank Branch Must Be A Minimum Of 4 Characters")
      .max(50, "Bank Branch Must Be A Maximum Of 50 Characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Bank Branch Must Contain Only Letters And Spaces"
      )
      .optional(),
    accountName: z
      .string("Account Name Must Be A String")
      .min(4, "Account Name Must Be A Minimum Of 4 Characters")
      .max(50, "Account Name Must Be A Maximum Of 50 Characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Account Name Must Contain Only Letters And Spaces"
      )
      .uppercase("Account Name Must Be Uppercase")
      .optional(),
    accountNumber: z
      .string("Account Number Must Be A Valid Bank Account Number")
      .min(10, "Account Number Must Be A Minimum Of 10 Digits")
      .max(20, "Account Number Must Be A Maximum Of 20 Digits")
      .regex(/^\d{10,20}$/, "Account Number Must Be 10 To 20 Digits")
      .optional(),
    accountExpiry: z.date("Account Expiry Must Be A Valid Date").optional(),
  },
  "Invalid Or Unsupported Billing Properties Provided"
);

export const updateOrganizerValidatorSchema = z.strictObject(
  {
    name: z
      .string("Name Must Be A Valid First, Middle, And Last Name")
      .min(4, "Name Must Be A Minimum Of 4 Characters")
      .max(50, "Name Must Be A Maximum Of 50 Characters")
      .regex(/^[A-Za-z\s]+$/, "Name Must Contain Only Letters And Spaces")
      .trim()
      .optional(),
    mobile: z
      .number("Mobile Number Must Be A Valid 10 Digit Number")
      .positive("Mobile Number Must Be A Valid 10 Digit Number")
      .refine(
        (value) => ["6", "7", "8", "9"].includes(value.toString()[0]!),
        "Mobile Number Must Start With 6, 7, 8, Or 9"
      )
      .min(6000000000, "Mobile Number Must Be 10 Digits")
      .max(9999999999, "Mobile Number Must Be 10 Digits")
      .optional(),
    profile: profileValidatorSchema.optional(),
    billing: billingValidatorSchema.optional(),
  },
  "Invalid Or Unsupported Properties Provided"
);

const updateOrganizerValidator = validator(
  "json",
  updateOrganizerValidatorSchema
);

export type UpdateOrganizerValidatorSchema = z.infer<
  typeof updateOrganizerValidatorSchema
>;

export default updateOrganizerValidator;
