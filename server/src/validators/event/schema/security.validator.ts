import * as z from "zod";

const codeSchema = z
  .strictObject(
    {
      type: z
        .enum(["single", "multiple"], "Invalid Security Code Type")
        .default("multiple"),
      active: z
        .boolean("Security Code Must Be Enabled Or Disabled")
        .default(true),
      code: z
        .string("Security Code Must Be A Valid String")
        .min(4, "Security Code Must Be A Minimum Of 4 Characters")
        .max(10, "Security Code Must Be A Maximum Of 10 Characters")
        .regex(
          /^[A-Za-z0-9]+$/,
          "Security Code Must Contain Letters And Numbers"
        )
        .trim(),
      uses: z
        .number("Security Code Uses Must Be A Valid Number")
        .min(1, "Security Code Uses Be A Minimum Of 1")
        .max(500, "Security Code Uses Be A Maximum Of 500"),
      expiry: z
        .string("Security Code Expiry Date Must Be YYYY-MM-DD Format")
        .regex(
          /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
          "Security Code Expiry Date Must Be In YYYY-MM-DD Format"
        )
        .refine((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime()) && date > new Date();
        }, "Security Code Expiry Date Must Be A Future Date")
        .trim()
        .optional(),
    },
    "Security Code Details Must Be Provided"
  )
  .superRefine((values, ctx) => {
    const { type, uses } = values;

    if (type === "single" && uses > 1) {
      return ctx.addIssue({
        code: "custom",
        message: "Uses Must Be Set To 1 For Single Use Codes",
      });
    }

    if (type === "multiple" && uses === 1) {
      return ctx.addIssue({
        code: "custom",
        message: "Uses Must Be Set To At Least 2 For Multi Use Codes",
      });
    }
  });

export const eventSecurityValidatorSchema = z.strictObject(
  {
    codes: z
      .array(codeSchema)
      .refine((values) => {
        const codes = values.map((security) => security.code);
        return codes.length === new Set(codes).size;
      }, "Security Codes Must Be Unique")
      .min(1, "At Least 1 Security Code Must Be Provided")
      .max(10, "At Most 10 Security Codes Must Be Provided"),
  },
  "Only Event Security Codes Must Be Provided"
);

export type EventSecurityValidatorSchema = z.infer<
  typeof eventSecurityValidatorSchema
>;
