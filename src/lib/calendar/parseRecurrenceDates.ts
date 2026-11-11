import { parseCalendarDateTime } from "./parseCalendarDateTime";

export function parseRecurrenceDates(
  startsAt: string,
  endsAt: string,
  timeZone = "Asia/Kuwait",
): { start: Date; end: Date; durationMs: number } | null {
  const start = parseCalendarDateTime(startsAt, timeZone);
  const end = parseCalendarDateTime(endsAt, timeZone);
  if (!start || !end || end.getTime() < start.getTime()) {
    return null;
  }
  return { start, end, durationMs: end.getTime() - start.getTime() };
}
