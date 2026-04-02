import * as z from "zod";

export const ticketScheduleValidatorSchema = z
  .strictObject(
    {
      startDate: z
        .string("Ticket Sales Start Date Must Be YYYY-MM-DD Format")
        .regex(
          /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
          "Ticket Sales Start Date Must Be In YYYY-MM-DD Format",
        )
        .refine((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime()) && date > new Date();
        }, "Ticket Sales Start Date Must Be A Future Date")
        .trim(),
      startTime: z
        .string("Ticket Sales Start Time Must Be In The 24 Hour Format")
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "Ticket Sales Start Time Must Be In The 24 Hour Format",
        )
        .trim(),
      endDate: z
        .string("Ticket Sales End Date Must Be YYYY-MM-DD Format")
        .regex(
          /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
          "Ticket Sales End Date Must Be In YYYY-MM-DD Format",
        )
        .refine((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime()) && date > new Date();
        }, "Ticket Sales End Date Must Be A Future Date")
        .trim(),
      endTime: z
        .string("Ticket Sales End Time Must Be In The 24 Hour Format")
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "Ticket Sales End Time Must Be In The 24 Hour Format",
        )
        .trim(),
    },
    "Ticket Schedule Details Must Be Provided",
  )
  .superRefine((data, ctx) => {
    const { endDate, endTime, startDate, startTime } = data;

    const _startDate = new Date(`${startDate}T${startTime}:00`);
    const _endDate = new Date(`${endDate}T${endTime}:00`);

    if (_startDate >= _endDate) {
      return ctx.addIssue({
        code: "custom",
        message: "Ticket Sales Start Date Must Be Set Before The End Date",
      });
    }
  });

/**
 * A type that represents the validated ticket schedule details payload.
 */
export type TicketScheduleValidatorSchema = z.infer<
  typeof ticketScheduleValidatorSchema
>;
