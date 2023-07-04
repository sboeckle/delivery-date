import dayjs from "dayjs";

/**
 * creates and formats date for the given weekday relative in the future to the given date.
 * in standard format of ISO8601 e.g. 2023-06-26T02:00:00+02:00
 * @param today
 * @param weekDay
 * @returns
 */
export function getDateForDayInFuture(today: Date, weekDay: number): string {
  const dateCopy = dayjs(today).set("day", weekDay);

  if (weekDay > 6) {
    const weeksAhead = Math.floor(weekDay / 7);
    dateCopy.add(weeksAhead * 6, "day");
  }
  return dateCopy.format();
}

export function differenceInDays(date1: Date, date2: Date): number {
  return Math.ceil(
    Math.abs(date1.getTime() - date2.getTime()) / (1000 * 3600 * 24)
  );
}
