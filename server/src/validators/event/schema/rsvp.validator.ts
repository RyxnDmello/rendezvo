import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const validatorSchema = z.strictObject(
  {
    required: z
      .boolean("Required Validator Can Either Be True Or False")
      .default(true)
      .optional(),
    min: z
      .number("Minimum Number Validator Must Be A Valid Number")
      .min(-999999, "Minimum Number Validator Cannot Be Less Than -999999")
      .max(999999, "Minimum Number Validator Cannot Be More Than 999999")
      .optional(),
    max: z
      .number("Maximum Number Validator Must Be A Valid Number")
      .min(-999999, "Maximum Number Validator Cannot Be Less Than -999999")
      .max(999999, "Maximum Number Validator Cannot Be More Than 999999")
      .optional(),
    minDate: z
      .string("Minimum Date Validator Must Be YYYY-MM-DD Format")
      .regex(
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        "Minimum Date Validator Must Be In YYYY-MM-DD Format"
      )
      .trim()
      .optional(),
    maxDate: z
      .string("Maximum Date Validator Must Be YYYY-MM-DD Format")
      .regex(
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        "Maximum Date Validator Must Be In YYYY-MM-DD Format"
      )
      .trim()
      .optional(),
    minLength: z
      .number("Minimum Text Validator Must Be A Valid Number")
      .min(1, "Minimum Text Validator Cannot Be Less Than 1")
      .max(50, "Minimum Text Validator Cannot Be More Than 50")
      .optional(),
    maxLength: z
      .number("Maximum Text Validator Must Be A Valid Number")
      .min(1, "Maximum Text Validator Cannot Be Less Than 1")
      .max(50, "Maximum Text Validator Cannot Be More Than 50")
      .optional(),
  },
  "Field Validation Must Be Provided"
);

const fieldSchema = z
  .strictObject(
    {
      type: z.enum(
        ["text", "number", "date", "dropdown"],
        "Invalid Field Type Provided"
      ),
      name: z
        .string("Field Name Must Be A String")
        .uppercase("Field Name Must Be Uppercase")
        .min(2, "Field Name Must Be A Minimum Of 2 Characters")
        .max(10, "Field Name Must Be A Maximum Of 10 Characters")
        .regex(/^[A-Za-z]+$/, "Field Name Must Contain Only Letters"),
      label: z
        .string("Field Label Must Be A String")
        .min(2, "Field Label Must Be A Minimum Of 2 Characters")
        .max(10, "Field Label Must Be A Maximum Of 10 Characters")
        .regex(/^[A-Za-z ]+$/, "Field Label Must Contain Only Letters"),
      placeholder: z
        .string("Field Placeholder Must Be A String")
        .min(4, "Field Placeholder Must Be A Minimum Of 4 Characters")
        .max(50, "Field Placeholder Must Be A Maximum Of 50 Characters"),
      options: z
        .array(
          z
            .string("Dropdown Option Must Be A String")
            .min(1, "Dropdown Option Must Be A Minimum Of 1 Character")
            .max(10, "Dropdown Option Must Be A Maximum Of 10 Character"),
          "Dropdown Options Must Be A List Of Options"
        )
        .refine((options) => {
          const unique = new Set(options);
          return unique.size === options.length;
        }, "Every Option In The Dropdown Must Be Unique")
        .min(2, "At Least 2 Dropdown Options Must Be Provided")
        .max(10, "At Most 10 Dropdown Options Must Be Provided")
        .optional(),
      validator: validatorSchema,
    },
    "RSVP Fields Must Be Provided"
  )
  .superRefine((values, ctx) => {
    const { type, options, validator } = values;

    const { min, max, minDate, maxDate, minLength, maxLength } = validator;

    if (type === "dropdown") {
      if (min || max || minDate || maxDate || minLength || maxLength) {
        return ctx.addIssue({
          code: "custom",
          message: "Invalid Validators Provided For A Dropdown Field",
        });
      }

      if (!options) {
        return ctx.addIssue({
          code: "custom",
          message: "Dropdown Fields Must Have At Least 2 Options",
        });
      }

      return;
    }

    if (options) {
      return ctx.addIssue({
        code: "custom",
        message: "Non Dropdown Fields Cannot Have Options",
      });
    }

    if (type === "text") {
      if (min || max || minDate || maxDate) {
        return ctx.addIssue({
          code: "custom",
          message: "Invalid Validators Provided For A Text Field",
        });
      }

      if (!minLength || !maxLength) {
        return ctx.addIssue({
          code: "custom",
          message: "Text Field Length Validation Must Be Provided",
        });
      }

      if (minLength >= maxLength) {
        return ctx.addIssue({
          code: "custom",
          message: "Invalid Text Field Length Validation",
        });
      }

      return;
    }

    if (type === "number") {
      if (minDate || maxDate || minLength || maxLength) {
        return ctx.addIssue({
          code: "custom",
          message: "Invalid Validators Provided For A Number Field",
        });
      }

      if (!min || !max) {
        return ctx.addIssue({
          code: "custom",
          message: "Number Field Range Validation Must Be Provided",
        });
      }

      if (min > max) {
        return ctx.addIssue({
          code: "custom",
          message: "Invalid Number Field Range Validation",
        });
      }

      return;
    }

    if (min || max || minLength || maxLength) {
      return ctx.addIssue({
        code: "custom",
        message: "Invalid Validators Provided For A Date Field",
      });
    }

    if (!minDate || !maxDate) {
      return ctx.addIssue({
        code: "custom",
        message: "Date Field Range Validation Must Be Provided",
      });
    }

    if (new Date(minDate) > new Date(maxDate)) {
      return ctx.addIssue({
        code: "custom",
        message: "Invalid Date Field Range Validation",
      });
    }
  });

const eventRsvpValidatorSchema = z.strictObject(
  {
    fields: z
      .array(fieldSchema)
      .refine((fields) => {
        const names = fields.map((field) => field.name);
        return names.length === new Set(names).size;
      }, "Each Field Must Have A Unique Name")
      .min(1, "At Least 1 RSVP Field Must Be Provided")
      .max(5, "At Most 5 RSVP Field Must Be Provided"),
  },
  "Only Event RSVP Details Must Be Provided"
);

const eventRsvpValidator = validator("json", eventRsvpValidatorSchema);

export type EventRsvpValidatorSchema = z.infer<typeof eventRsvpValidatorSchema>;

export type EventRsvpContext = ValidatorContext<typeof eventRsvpValidator>;

export default eventRsvpValidator;
