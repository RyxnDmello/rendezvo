import * as z from "zod";

import validator from "@middlewares/validator.middleware";

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

const createEventValidatorSchema = z.strictObject(
  {
    ownerID: z.string("Owner ID Must Be A Valid String ID"),
    mode: z.enum(["online", "offline"], "Invalid Event Mode"),
    attendance: z.enum(["open", "rsvp"], "Invalid Event Attendance"),
    visibility: z.enum(["public", "private"], "Invalid Event Visibility"),
    basic: basicSchema,
    address: addressSchema,
    schedule: scheduleSchema,
  },
  "Only Event Details Must Be Provided"
);

const createEventValidator = validator("json", createEventValidatorSchema);

export type CreateEventValidatorSchema = z.infer<
  typeof createEventValidatorSchema
>;

export default createEventValidator;
