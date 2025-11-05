import * as z from "zod";

import validator, { ValidatorContext } from "@middlewares/validator.middleware";

const basicSchema = z.strictObject(
  {
    title: z
      .string("Event Title Must Be A String")
      .min(4, "Event Title Must Be A Minimum Of 4 Characters")
      .max(25, "Event Title Must Be A Maximum Of 25 Characters")
      .trim(),
    category: z
      .string("Event Category Must Be A Single Worded String")
      .lowercase("Event Category Must Be Lowercase")
      .min(4, "Event Category Must Be A Minimum Of 4 Characters")
      .max(10, "Event Category Must Be A Maximum Of 10 Characters")
      .regex(/^[A-Za-z]+$/, "Event Category Must Contain Only Letters")
      .trim(),
    description: z
      .string("Event Description Must Be A String")
      .min(10, "Event Description Must Be A Minimum Of 10 Characters")
      .max(500, "Event Description Must Be A Maximum Of 500 Characters")
      .trim(),
    tags: z
      .array(
        z
          .string("Event Tag Must Be A String")
          .lowercase("Event Tag Must Be Lowercase")
          .min(4, "Event Tag Must Be A Minimum Of 4 Characters")
          .max(10, "Event Tag Must Be A Maximum Of 10 Characters")
          .regex(/^[A-Za-z]+$/, "Event Tag Must Contain Only Letters")
          .trim(),
        "Tags Must Be A List Of Valid Tags"
      )
      .refine((tags) => {
        const unique = new Set(tags);
        return unique.size === tags.length;
      }, "Duplicate Event Tags Are Not Allowed")
      .min(1, "Event Tags Must Be A Minimum Of 1")
      .max(10, "Event Tags Must Be A Maximum Of 10")
      .optional(),
  },
  "Event Basic Details Must Be Provided"
);

const addressSchema = z.strictObject(
  {
    url: z.url("Address URL Must Be A Valid URL").trim().optional(),
    firstLine: z
      .string("Address First Line Must Be A Valid String")
      .min(4, "Address First Line Must Be A Minimum Of 4 Characters")
      .max(50, "Address First Line Must Be A Maximum Of 50 Characters"),
    secondLine: z
      .string("Address Second Line Must Be A Valid String")
      .min(4, "Address Second Line Must Be A Minimum Of 4 Characters")
      .max(50, "Address Second Line Must Be A Maximum Of 50 Characters")
      .optional(),
    country: z
      .string("Country Must Be A Valid String")
      .min(2, "Country Must Be A Minimum Of 2 Characters")
      .max(25, "Country Must Be A Maximum Of 25 Characters"),
    state: z
      .string("State Must Be A Valid String")
      .min(2, "State Must Be A Minimum Of 2 Characters")
      .max(25, "State Must Be A Maximum Of 25 Characters"),
    city: z
      .string("City Must Be A Valid String")
      .min(2, "City Must Be A Minimum Of 2 Characters")
      .max(25, "City Must Be A Maximum Of 25 Characters"),
    zip: z
      .string("Zip Code Must Be 6 Digits")
      .min(6, "Zip Code Must Be 6 Digits")
      .max(6, "Zip Code Must Be 6 Digits")
      .regex(/^\d{6}$/, "Zip Code Must Contain 6 Digits"),
  },
  "Address Details Must Be Provided"
);

const scheduleSchema = z
  .strictObject(
    {
      type: z.enum(
        ["single", "daily", "weekly", "custom"],
        "Invalid Event Schedule Type"
      ),
      startDate: z
        .string("Event Start Date Must Be YYYY-MM-DD Format")
        .regex(
          /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
          "Event Start Date Must Be In YYYY-MM-DD Format"
        )
        .refine((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime()) && date > new Date();
        }, "Event Start Date Must Be A Future Date")
        .trim()
        .optional(),
      startTime: z
        .string("Event Start Time Must Be In The 24 Hour Format")
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "Event Start Time Must Be In The 24 Hour Format"
        )
        .optional(),
      endDate: z
        .string("Event End Date Must Be YYYY-MM-DD Format")
        .regex(
          /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
          "Event End Date Must Be In YYYY-MM-DD Format"
        )
        .refine((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime()) && date > new Date();
        }, "Event End Date Must Be A Future Date")
        .trim()
        .optional(),
      endTime: z
        .string("Event End Time Must Be In The 24 Hour Format")
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "Event End Time Must Be In The 24 Hour Format"
        )
        .optional(),
      dates: z
        .array(
          z
            .string("Custom Date Must Be YYYY-MM-DD Format")
            .regex(
              /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
              "Custom Date Must Be In YYYY-MM-DD Format"
            )
            .refine((val) => {
              const date = new Date(val);
              return !isNaN(date.getTime()) && date > new Date();
            }, "Custom Date Must Be A Future Date")
            .trim(),
          "Custom Dates Must Be A List Of Valid Dates"
        )
        .min(2, "At Least 2 Event Dates Must Be Provided")
        .max(30, "At Most 30 Event Dates Must Be Provided")
        .refine((dates) => {
          const unique = new Set(dates);
          return unique.size === dates.length;
        }, "Duplicate Dates Are Not Allowed")
        .optional(),
      slots: z
        .array(
          z.strictObject(
            {
              startTime: z
                .string("Slot Start Time Must Be In The 24 Hour Format")
                .regex(
                  /^([01]\d|2[0-3]):([0-5]\d)$/,
                  "Slot Start Time Must Be In The 24 Hour Format"
                )
                .trim(),
              endTime: z
                .string("Slot End Time Must Be In The 24 Hour Format")
                .regex(
                  /^([01]\d|2[0-3]):([0-5]\d)$/,
                  "Slot End Time Must Be In The 24 Hour Format"
                )
                .trim(),
            },
            "Slot Start And Time Time Must Be Provided"
          ),
          "Time Slots Must Be A List Of Valid Time Slots"
        )
        .min(2, "At Least 2 Time Slots Must Be Provided")
        .max(10, "At Most 10 Time Slots Must Be Provided")
        .optional(),
      weekly: z
        .array(
          z.enum(
            ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            "Invalid Day Of The Week Provided"
          ),
          "Weekly Must Be A List Of The Selected Days Of The Week"
        )
        .refine((weekly) => {
          const unique = new Set(weekly);
          return unique.size === weekly.length;
        }, "Duplicate Days Of The Week Are Not Allowed")
        .min(1, "At Least 1 Day Of The Week Must Be Provided")
        .max(7, "At Most All Days Of The Week Must Be Provided")
        .optional(),
      exceptions: z
        .array(
          z
            .string("Exception Date Must Be YYYY-MM-DD Format")
            .regex(
              /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
              "Exception Date Must Be YYYY-MM-DD Format"
            )
            .refine((val) => {
              const date = new Date(val);
              return !isNaN(date.getTime()) && date > new Date();
            }, "Exception Date Must Be A Future Date")
            .trim(),
          "Exception Dates Must Be A List Of Valid Dates"
        )
        .min(1, "At Least 1 Exception Date Must Be Provided")
        .max(30, "At Most 30 Exception Dates Must Be Provided")
        .refine((dates) => {
          const unique = new Set(dates);
          return unique.size === dates.length;
        }, "Duplicate Exception Dates Are Not Allowed")
        .optional(),
    },
    "Event Schedule Details Must Be Provided"
  )
  .superRefine((data, ctx) => {
    const {
      type,
      slots,
      dates,
      weekly,
      endDate,
      endTime,
      startDate,
      startTime,
      exceptions,
    } = data;

    if (startTime || endTime) {
      if (slots) {
        return ctx.addIssue({
          code: "custom",
          message: "An Event Can Either Have A Fixed Time Or Slots, Not Both",
        });
      }

      if (!startTime) {
        return ctx.addIssue({
          code: "custom",
          message: "Please Provide An Event Start Time",
        });
      }

      if (!endTime) {
        return ctx.addIssue({
          code: "custom",
          message: "Please Provide An Event End Time",
        });
      }
    }

    if (!startTime && !endTime && !slots) {
      return ctx.addIssue({
        code: "custom",
        message: "An Event Must Have Either A Fixed Time Or Slots",
      });
    }

    if (type === "custom") {
      if (startDate || endDate) {
        return ctx.addIssue({
          code: "custom",
          message: "Start And End Date Are Not Allowed For Custom Events",
        });
      }

      if (weekly) {
        return ctx.addIssue({
          code: "custom",
          message: "Days Of The Week Are Not Allowed For Custom Events",
        });
      }

      if (!dates) {
        return ctx.addIssue({
          code: "custom",
          message: "Event Dates Must Be Provided For Custom Events",
        });
      }

      return;
    }

    const _type = type[0]?.toUpperCase() + type.substring(1);

    if (dates) {
      return ctx.addIssue({
        code: "custom",
        message: `Custom Dates Are Not Allowed For ${_type} Events`,
      });
    }

    if (!startDate) {
      return ctx.addIssue({
        code: "custom",
        message: "Event Start Date Must Be Provided",
      });
    }

    if (!endDate) {
      return ctx.addIssue({
        code: "custom",
        message: "Event End Date Must Be Provided",
      });
    }

    let _startDate = new Date(startDate);
    let _endDate = new Date(endDate);

    if (startDate && endDate) {
      _startDate = new Date(`${startDate}T${startTime}:00`);
      _endDate = new Date(`${endDate}T${endTime}:00`);
    }

    if (type === "single") {
      if (_startDate > _endDate) {
        return ctx.addIssue({
          code: "custom",
          message: "Event Start Date Must Be Set Before The End Date",
        });
      }

      if (exceptions) {
        return ctx.addIssue({
          code: "custom",
          message: `Schedule Exception Dates Are Not Allowed`,
        });
      }
    } else {
      if (startDate === endDate) {
        return ctx.addIssue({
          code: "custom",
          message: `Start And End Date Cannot Be The Same For ${_type} Events`,
        });
      }

      if (_startDate >= _endDate) {
        return ctx.addIssue({
          code: "custom",
          message: "Event Start Date Must Be Set On Or Before The End Date",
        });
      }
    }

    if (type === "weekly" && !weekly) {
      return ctx.addIssue({
        code: "custom",
        message: "Weekly Events Must Provide The Selected Days Of The Week",
      });
    }

    if (type !== "weekly" && weekly) {
      return ctx.addIssue({
        code: "custom",
        message: `Custom Days Of The Week Are Not Allowed For ${_type} Events`,
      });
    }
  });

const policySchema = z.strictObject(
  {
    terms: z.strictObject(
      {
        title: z
          .string("Terms & Conditions Title Must Be A String")
          .min(4, "Terms Title Must Be A Minimum Of 4 Characters")
          .max(50, "Terms Title Must Be A Maximum Of 50 Characters")
          .trim(),
        description: z
          .string("Terms & Conditions Description Must Be A String")
          .min(4, "Terms Description Must Be A Minimum Of 4 Characters")
          .max(500, "Terms Description Must Be A Maximum Of 500 Characters")
          .trim(),
      },
      "Event Terms & Condition Policy Details Must Be Provided"
    ),
    refund: z.strictObject(
      {
        title: z
          .string("Refund Policy Title Must Be A String")
          .min(4, "Refund Title Must Be A Minimum Of 4 Characters")
          .max(50, "Refund Title Must Be A Maximum Of 50 Characters")
          .trim(),
        duration: z
          .number("Refund Duration Must Be A Number")
          .min(7, "Refund Duration Must Be A Minimum Of 7 Days")
          .max(14, "Refund Duration Must Be A Maximum Of 14 Days")
          .default(7),
        description: z
          .string("Refund Policy Description Must Be A String")
          .min(4, "Refund Description Must Be A Minimum Of 4 Characters")
          .max(250, "Refund Description Must Be A Maximum Of 250 Characters")
          .trim(),
      },
      "Event Refund Policy Details Must Be Provided"
    ),
  },
  "Event Policy Details Must Be Provided"
);

const rsvpSchema = z
  .strictObject(
    {
      fields: z
        .array(
          z
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
                  .regex(
                    /^[A-Za-z ]+$/,
                    "Field Label Must Contain Only Letters"
                  ),
                placeholder: z
                  .string("Field Placeholder Must Be A String")
                  .min(4, "Field Placeholder Must Be A Minimum Of 4 Characters")
                  .max(
                    50,
                    "Field Placeholder Must Be A Maximum Of 50 Characters"
                  ),
                options: z
                  .array(
                    z
                      .string("Dropdown Option Must Be A String")
                      .min(
                        1,
                        "Dropdown Option Must Be A Minimum Of 1 Character"
                      )
                      .max(
                        10,
                        "Dropdown Option Must Be A Maximum Of 10 Character"
                      ),
                    "Dropdown Options Must Be A List Of Options"
                  )
                  .refine((options) => {
                    const unique = new Set(options);
                    return unique.size === options.length;
                  }, "Every Option In The Dropdown Must Be Unique")
                  .min(2, "At Least 2 Dropdown Options Must Be Provided")
                  .max(10, "At Most 10 Dropdown Options Must Be Provided")
                  .optional(),
                validator: z.strictObject(
                  {
                    required: z
                      .boolean("Required Validator Can Either Be True Or False")
                      .default(true)
                      .optional(),
                    min: z
                      .number("Minimum Number Validator Must Be A Valid Number")
                      .min(
                        -999999,
                        "Minimum Number Validator Cannot Be Less Than -999999"
                      )
                      .max(
                        999999,
                        "Minimum Number Validator Cannot Be More Than 999999"
                      )
                      .optional(),
                    max: z
                      .number("Maximum Number Validator Must Be A Valid Number")
                      .min(
                        -999999,
                        "Maximum Number Validator Cannot Be Less Than -999999"
                      )
                      .max(
                        999999,
                        "Maximum Number Validator Cannot Be More Than 999999"
                      )
                      .optional(),
                    minDate: z
                      .string(
                        "Minimum Date Validator Must Be YYYY-MM-DD Format"
                      )
                      .regex(
                        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
                        "Minimum Date Validator Must Be In YYYY-MM-DD Format"
                      )
                      .trim()
                      .optional(),
                    maxDate: z
                      .string(
                        "Maximum Date Validator Must Be YYYY-MM-DD Format"
                      )
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
                ),
              },
              "RSVP Fields Must Be Provided"
            )
            .superRefine((values, ctx) => {
              const { type, options, validator } = values;

              const { min, max, minDate, maxDate, minLength, maxLength } =
                validator;

              if (type === "dropdown") {
                if (
                  min ||
                  max ||
                  minDate ||
                  maxDate ||
                  minLength ||
                  maxLength
                ) {
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
            }),
          "RSVP Fields Must Be A List Of Valid Fields"
        )
        .refine((fields) => {
          const names = fields.map((field) => field.name);
          return names.length === new Set(names).size;
        }, "Each Field Must Have A Unique Name")
        .min(1, "At Least 1 RSVP Field Must Be Provided")
        .max(5, "At Most 5 RSVP Field Must Be Provided"),
    },
    "Event RSVP Details Must Be Provided"
  )
  .optional();

const securitySchema = z
  .strictObject(
    {
      codes: z
        .array(
          z
            .strictObject(
              {
                type: z
                  .enum(["single", "multiple"], "Invalid Security Code Type")
                  .default("multiple"),
                active: z
                  .boolean("Code Activation Must Be Either True Or False")
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
            }),
          "Security Codes Must Be A List Of Valid Codes"
        )
        .refine((values) => {
          const codes = values.map((security) => security.code);
          return codes.length === new Set(codes).size;
        }, "Security Codes Must Be Unique")
        .min(1, "At Least 1 Security Code Must Be Provided")
        .max(10, "At Most 10 Security Codes Must Be Provided"),
    },
    "Event Security Codes Must Be Provided"
  )
  .optional();

const createEventValidatorSchema = z
  .strictObject(
    {
      ownerID: z.string("Owner ID Must Be A Valid String ID"),
      mode: z.enum(["online", "offline"], "Invalid Event Mode"),
      attendance: z.enum(["open", "rsvp"], "Invalid Event Attendance"),
      visibility: z.enum(["public", "private"], "Invalid Event Visibility"),
      basic: basicSchema,
      address: addressSchema,
      schedule: scheduleSchema,
      policy: policySchema,
      rsvp: rsvpSchema,
      security: securitySchema,
    },
    "Only Event Details Must Be Provided"
  )
  .superRefine((values, ctx) => {
    const { attendance, visibility, rsvp, security } = values;

    if (attendance === "open" && rsvp) {
      return ctx.addIssue({
        code: "custom",
        message: "RSVP Details Are Not Allowed For Open Attendance Events",
      });
    }

    if (attendance === "rsvp" && !rsvp) {
      return ctx.addIssue({
        code: "custom",
        message: "RSVP Details Must Be Provided For RSVP Attendance Events",
      });
    }

    if (visibility === "public" && security) {
      return ctx.addIssue({
        code: "custom",
        message: "Access Codes Are Not Allowed For Public Visibility Events",
      });
    }

    if (visibility === "private" && !security) {
      return ctx.addIssue({
        code: "custom",
        message: "Access Codes Must Be Provided For Private Visibility Events",
      });
    }
  });

const createEventValidator = validator("json", createEventValidatorSchema);

export type CreateEventValidatorSchema = z.infer<
  typeof createEventValidatorSchema
>;

export type CreateEventContext = ValidatorContext<typeof createEventValidator>;

export default createEventValidator;
