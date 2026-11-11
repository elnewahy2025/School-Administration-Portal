import type { CalendarCategory, CalendarStatus, CalendarVisibility } from "@/lib/calendar/types";
import { parseCalendarRecurrenceInput } from "./parseCalendarRecurrenceInput";
import { parseFormCheckbox } from "./parseFormCheckbox";
import { calendarSchema } from "./calendarSchema";
import { formatZodError } from "./formatZodError";

export function parseCalendarFormData(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const imageEntry = formData.get("image");
  const image = imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;
  const isAllDay = parseFormCheckbox(formData, "all_day");
  const isPublishImmediately = parseFormCheckbox(formData, "publish_immediately");
  const recurrence = parseCalendarRecurrenceInput(formData);

  const rawInput = {
    titleAr: get("title_ar"),
    titleEn: get("title_en") || null,
    description: get("description") || null,
    category: get("category") || "event",
    startsAt: get("starts_at"),
    endsAt: get("ends_at"),
    visibility: get("visibility") || "internal",
    location: get("location") || null,
  };

  const parsed = calendarSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw formatZodError(parsed.error);
  }

  const status: CalendarStatus = isPublishImmediately ? "published" : "draft";

  return {
    ...parsed.data,
    category: parsed.data.category as CalendarCategory,
    visibility: parsed.data.visibility as CalendarVisibility,
    status,
    allDay: isAllDay,
    publishImmediately: isPublishImmediately,
    image,
    ...recurrence,
  };
}
