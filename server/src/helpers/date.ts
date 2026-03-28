import { addMinutes, addHours } from "date-fns";

export function getDate(minutes: number, hours: number = 0) {
  let date = new Date();
  date = addHours(date, hours);
  date = addMinutes(date, minutes);
  return date;
}
