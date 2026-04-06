/**
 * A helper function to return a new date by combining the given date and time.
 *
 * The date must be a JavaScript Date object, while the time must be a string in
 * the HH:MM format, such as 00:00 - 23:59.
 *
 * @param date - The date to be used in the combination.
 * @param time - The time, in the 24 hour format (HH:MM), to be used in the combination.
 *
 * @returns A new date, by combining the date and time.
 */
export const getCombinedDate = (date: Date, time: String) => {
  const [hours, minutes] = time.split(":").map(Number);

  const newDate = new Date(date);
  newDate.setHours(hours!, minutes!, 0, 0);

  return newDate;
};
