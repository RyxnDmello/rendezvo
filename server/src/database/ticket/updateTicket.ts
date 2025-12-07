import { Schedule } from "@schemas/event/schedule.schema";

import EventModel from "@models/event.model";
import OrganizerModel from "@models/organizer.model";

import { UpdateTicketValidatorSchema } from "@validators/ticket/updateTicket.validator";

import MongooseError, { isMongooseError } from "@utils/MongooseError";
import ApiError, { isApiError } from "@utils/ApiError";

const updateTicket = async (
  id: string,
  ticketID: string,
  data: UpdateTicketValidatorSchema
) => {
  try {
    const [dbEvent, dbOrganizer] = await Promise.all([
      EventModel.findById(id, {
        ownerID: 1,
        tickets: 1,
        schedule: 1,
      }).lean({
        versionKey: false,
      }),
      OrganizerModel.exists({
        _id: data.ownerID,
      }),
    ]);

    if (!dbEvent) {
      throw new ApiError("Event With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (!dbOrganizer) {
      throw new ApiError("User With Given ID Does Not Exist", "BAD_REQUEST");
    }

    if (dbEvent.ownerID !== data.ownerID) {
      throw new ApiError(
        "You Do Not Have The Permission To Make This Request",
        "UNAUTHORIZED"
      );
    }

    if (!dbEvent.tickets || dbEvent.tickets.length === 0) {
      throw new ApiError("Event With Given ID Has No Tickets", "BAD_REQUEST");
    }

    const index = dbEvent.tickets.findIndex((ticket) => ticket.id === ticketID);

    if (index === -1) {
      throw new ApiError("Ticket With Given ID Does Not Exist", "BAD_REQUEST");
    }

    const dbTicket = dbEvent.tickets[index]!;

    const { action, ...ticket } = data;

    if (action === "basic") {
      if (ticket.name) {
        const exists = dbEvent.tickets?.find((dbTicket) => {
          return dbTicket.name.toLowerCase() === ticket.name!.toLowerCase();
        });

        if (exists) {
          throw new ApiError(
            "Ticket With Given Name Already Exists",
            "VALIDATION_ERROR"
          );
        }

        dbTicket.name = ticket.name;
      }

      dbTicket.description = ticket.description ?? dbTicket.description;
    }

    if (action === "pricing") {
      dbTicket.pricing = {
        entry: ticket.pricing!.entry,
        cover: ticket.pricing!.cover,
        total: ticket.pricing!.entry + ticket.pricing!.cover,
      };
    }

    if (action === "quantity") {
      const increment = ticket.quantity!.total - dbTicket.quantity.total;

      if (increment < 1) {
        throw new ApiError(
          "Ticket Quantity Must Be Greater Than The Current Quantity",
          "BAD_REQUEST"
        );
      }

      dbTicket.quantity = {
        ...dbTicket.quantity,
        total: dbTicket.quantity.total + increment,
        remaining: dbTicket.quantity.remaining + increment,
      };
    }

    if (action === "schedule") {
      validateSchedule(dbEvent.schedule, data.schedule);

      dbTicket.schedule = {
        ...data.schedule!,
        startDate: new Date(data.schedule!.startDate),
        endDate: new Date(data.schedule!.endDate),
      };
    }

    const tickets = dbEvent.tickets.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "free" ? -1 : 1;
      }

      return a.pricing.total - b.pricing.total;
    });

    const { acknowledged, modifiedCount } = await EventModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          tickets,
        },
      },
      {
        runValidators: true,
      }
    );

    if (!acknowledged || modifiedCount !== 1) {
      throw new ApiError(
        "Unable To Update Ticket Due To Server Error",
        "INTERNAL_SERVER_ERROR"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isMongooseError(error)) {
      throw new MongooseError(error);
    }

    throw new ApiError(
      "Unable To Update Ticket Due To Server Error",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

const validateSchedule = (
  eventSchedule: Schedule,
  ticketSchedule: UpdateTicketValidatorSchema["schedule"]
) => {
  const ticketStartDate = combine(
    new Date(ticketSchedule!.startDate),
    ticketSchedule!.startTime
  );

  const ticketEndDate = combine(
    new Date(ticketSchedule!.endDate),
    ticketSchedule!.endTime
  );

  if (eventSchedule.type === "custom") {
    const dates = eventSchedule.dates!;

    const eventStartDate = new Date(dates[0]!);
    const eventEndDate = new Date(dates[dates.length - 1]!);

    if (ticketStartDate > eventStartDate) {
      throw new ApiError(
        "Ticket Sales Start Date Must Be Set Before The Event Start Date",
        "VALIDATION_ERROR"
      );
    }

    if (ticketEndDate > eventEndDate) {
      throw new ApiError(
        "Ticket Sales End Date Must Be Set Before The Event End Date",
        "VALIDATION_ERROR"
      );
    }

    return;
  }

  if (!eventSchedule.slots) {
    const eventStartDate = combine(
      eventSchedule.startDate!,
      eventSchedule.startTime!
    );

    const eventEndDate = combine(
      eventSchedule.endDate!,
      eventSchedule.endTime!
    );

    if (ticketStartDate > eventStartDate) {
      throw new ApiError(
        "Ticket Sales Start Date Must Be Set Before The Event Start Date",
        "VALIDATION_ERROR"
      );
    }

    if (ticketEndDate > eventEndDate) {
      throw new ApiError(
        "Ticket Sales End Date Must Be Set Before The Event End Date",
        "VALIDATION_ERROR"
      );
    }

    return;
  }

  const eventStartDate = combine(
    eventSchedule.startDate!,
    eventSchedule.slots[0]!.startTime
  );

  const eventEndDate = combine(
    eventSchedule.endDate!,
    eventSchedule.slots[eventSchedule.slots.length - 1]!.endTime
  );

  if (ticketStartDate > eventStartDate) {
    throw new ApiError(
      "Ticket Sales Start Date Must Be Set Before The Event Start Date",
      "VALIDATION_ERROR"
    );
  }

  if (ticketEndDate > eventEndDate) {
    throw new ApiError(
      "Ticket Sales End Date Must Be Set Before The Event End Date",
      "VALIDATION_ERROR"
    );
  }
};

const combine = (date: Date, time: String) => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h!, m!, 0, 0);
  return d;
};

export default updateTicket;
