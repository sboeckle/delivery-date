const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function getDayName(date: Date): string {
  return dayNames[date.getDay()];
}

/**
 * returns new date obj based on given one and adds numbe of days
 * @param date
 * @param days
 * @returns
 */
export function addDays(date: Date, daysToAdd: number): Date {
  const newDate = new Date(date.getTime());
  newDate.setDate(date.getDate() + daysToAdd);
  return newDate;
}

export function differenceInDays(date1: Date, date2: Date): number {
  return Math.ceil(
    Math.abs(date1.getTime() - date2.getTime()) / (1000 * 3600 * 24)
  );
}
