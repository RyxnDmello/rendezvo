import { EventSchedule } from "@schemas/event/schedule.schema";

import { CreateOrderValidatorSchema } from "@validators/order/createOrder.validator";

import ApiError from "@utils/ApiError";

const validateSchedule = (
  orderSchedule: CreateOrderValidatorSchema["schedule"],
  eventSchedule: EventSchedule[],
) => {
  const date = new Date(orderSchedule.date);

  const datesMap = new Map(
    eventSchedule
      .filter((schedule) => schedule.active)
      .map((schedule) => [schedule.date.getTime(), schedule.slots]),
  );

  const slots = datesMap.get(date.getTime());

  if (slots === undefined) {
    throw new ApiError("Invalid Event Date Selected", "VALIDATION_ERROR");
  }

  const slotTimeMap = new Map(
    slots
      .filter((slot) => slot.active)
      .map((slot) => [slot.startTime, slot.endTime]),
  );

  const endTime = slotTimeMap.get(orderSchedule.startTime);

  if (!endTime || orderSchedule.endTime !== endTime) {
    throw new ApiError("Invalid Event Time Slot Selected", "VALIDATION_ERROR");
  }
};

export default validateSchedule;
