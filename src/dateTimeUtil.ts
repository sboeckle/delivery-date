import dayjs from "dayjs";
import { NUMBER_OF_WEEKS_AHEAD } from "./config.json";

export function getDateForDayInFuture(today: Date, weekDay: number): Date {
  const dateCopy = new Date(today.getTime());

  const nextDay = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + weekDay) % 7 || 7)
    )
  );
  // TODO support only one week in future?
  if (weekDay >= 7) nextDay.setDate(nextDay.getDate() + 7);

  return nextDay;
}

export function differenceInDays(date1: Date, date2: Date): number {
  return Math.ceil(
    Math.abs(date1.getTime() - date2.getTime()) / (1000 * 3600 * 24)
  );
}

export function formatDate(date: Date) {
  // standard format of dayjs is ISO8601 e.g. 2023-06-26T02:00:00+02:00
  return dayjs(date).format();
}
