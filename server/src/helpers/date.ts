import { addMinutes, addHours } from "date-fns";

export function getExpiryDate(minutes: number, hours: number = 0) {
  let expiry = new Date();
  expiry = addHours(expiry, hours);
  expiry = addMinutes(expiry, minutes);
  return expiry;
}
