import { validateDateRange } from "@/lib/validation/validateDateRange";

export function assertValidCalendarInput(data: {
  titleAr: string;
  startsAt: string;
  endsAt: string;
}): string | null {
  if (!data.titleAr) {
    return "Title, start time, and end time are required";
  }
  if (!data.startsAt) {
    return "Title, start time, and end time are required";
  }
  if (!data.endsAt) {
    return "Title, start time, and end time are required";
  }
  if (!validateDateRange(data.startsAt, data.endsAt)) {
    return "End time must be after or equal to start time";
  }
  return null;
}
