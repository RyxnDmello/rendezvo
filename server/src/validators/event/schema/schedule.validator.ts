import * as z from "zod";

export const eventScheduleValidatorSchema = z
  .strictObject(
    {
      type: z.enum(
        ["single", "daily", "weekly", "custom"],
        "Invalid Event Schedule Type",
      ),
      startDate: z
        .string("Event Start Date Must Be YYYY-MM-DD Format")
        .regex(
          /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
          "Event Start Date Must Be In YYYY-MM-DD Format",
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
          "Event Start Time Must Be In The 24 Hour Format",
        )
        .optional(),
      endDate: z
        .string("Event End Date Must Be YYYY-MM-DD Format")
        .regex(
          /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
          "Event End Date Must Be In YYYY-MM-DD Format",
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
          "Event End Time Must Be In The 24 Hour Format",
        )
        .optional(),
      dates: z
        .array(
          z
            .string("Custom Date Must Be YYYY-MM-DD Format")
            .regex(
              /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
              "Custom Date Must Be In YYYY-MM-DD Format",
            )
            .refine((val) => {
              const date = new Date(val);
              return !isNaN(date.getTime()) && date > new Date();
            }, "Custom Date Must Be A Future Date")
            .trim(),
          "Custom Dates Must Be A List Of Valid Dates",
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
                  "Slot Start Time Must Be In The 24 Hour Format",
                )
                .trim(),
              endTime: z
                .string("Slot End Time Must Be In The 24 Hour Format")
                .regex(
                  /^([01]\d|2[0-3]):([0-5]\d)$/,
                  "Slot End Time Must Be In The 24 Hour Format",
                )
                .trim(),
            },
            "Slot Start And Time Time Must Be Provided",
          ),
          "Time Slots Must Be A List Of Valid Time Slots",
        )
        .min(2, "At Least 2 Time Slots Must Be Provided")
        .max(10, "At Most 10 Time Slots Must Be Provided")
        .optional(),
      weekly: z
        .array(
          z.enum(
            ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            "Invalid Day Of The Week Provided",
          ),
          "Weekly Must Be A List Of The Selected Days Of The Week",
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
              "Exception Date Must Be YYYY-MM-DD Format",
            )
            .refine((val) => {
              const date = new Date(val);
              return !isNaN(date.getTime()) && date > new Date();
            }, "Exception Date Must Be A Future Date")
            .trim(),
          "Exception Dates Must Be A List Of Valid Dates",
        )
        .min(1, "At Least 1 Exception Date Must Be Provided")
        .max(30, "At Most 30 Exception Dates Must Be Provided")
        .refine((dates) => {
          const unique = new Set(dates);
          return unique.size === dates.length;
        }, "Duplicate Exception Dates Are Not Allowed")
        .optional(),
    },
    "Event Schedule Details Must Be Provided",
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

export type EventScheduleValidatorSchema = z.infer<
  typeof eventScheduleValidatorSchema
>;
