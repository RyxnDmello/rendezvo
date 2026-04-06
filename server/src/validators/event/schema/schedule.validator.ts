import * as z from "zod";

export const slotSchema = z
  .strictObject(
    {
      active: z
        .boolean("Time Slot Must Either Be Enabled Or Disabled")
        .optional()
        .default(true),
      startTime: z
        .string("Slot Start Time Must Be In The 24 Hour Format")
        .regex(
          /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
          "Slot Start Time Must Be In The 24 Hour Format",
        )
        .trim(),
      endTime: z
        .string("Slot Start Time Must Be In The 24 Hour Format")
        .regex(
          /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
          "Slot Start Time Must Be In The 24 Hour Format",
        )
        .trim(),
    },
    "Only Slot Start And End Time Must Be Provided",
  )
  .superRefine((value, ctx) => {
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours! * 60 + minutes!;
    };

    const startTime = toMinutes(value.startTime);
    const endTime = toMinutes(value.endTime);

    if (startTime >= endTime) {
      ctx.addIssue({
        code: "custom",
        message: "Slot Start Time Must Be Less Than The End Time",
      });
    }

    if (endTime - startTime < 15) {
      ctx.addIssue({
        code: "custom",
        message: "Slot Duration Must Be At Least 15 Minutes",
      });
    }
  });

export const dateSchema = z.strictObject(
  {
    active: z
      .boolean("Event Date Must Either Be Enabled Or Disabled")
      .optional()
      .default(true),
    date: z
      .string("Event Date Must Be In The YYYY-MM-DD Format")
      .regex(
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        "Event Date Must Be In The YYYY-MM-DD Format",
      )
      .refine((value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date > new Date();
      }, "Event Date Must Be A Future Date")
      .trim(),
    slots: z
      .array(slotSchema, "Slots Must Be A Valid List Of Time Slots")
      .min(1, "At Least 1 Time Slot Must Be Provided")
      .max(10, "At Most 10 Time Slots Must Be Provided"),
  },
  "Only Event Date And Time Slots Must Be Provided",
);

export const eventScheduleValidatorSchema = z
  .array(dateSchema, "Event Schedule Must Be A List Of Valid Event Dates")
  .min(1, "At Least 1 Event Date Must Be Provided")
  .max(30, "At Most 30 Event Dates Must Be Provided")
  .superRefine((values, ctx) => {
    const dates = values.map((value) => value.date);

    if (new Set(dates).size !== dates.length) {
      return ctx.addIssue({
        code: "custom",
        message: "Event Dates Must Be Unique",
      });
    }

    for (let i = 1; i < dates.length; i++) {
      if (dates[i]! <= dates[i - 1]!) {
        ctx.addIssue({
          code: "custom",
          message: "Event Dates Must Strictly Be In The Ascending Order",
        });
      }
    }

    values.forEach((dateItem) => {
      const slots = dateItem.slots;

      for (let i = 1; i < slots.length; i++) {
        const prev = slots[i - 1]!.startTime;
        const current = slots[i]!.startTime;

        if (current <= prev) {
          ctx.addIssue({
            code: "custom",
            message: "Event Time Slots Must Strictly Be In The Ascending Order",
          });
        }
      }
    });
  });

/**
 * A type that represents the validated event schedule details payload.
 */
export type EventScheduleValidatorSchema = z.infer<
  typeof eventScheduleValidatorSchema
>;
