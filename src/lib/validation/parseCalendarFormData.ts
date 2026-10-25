import type { CalendarCategory, CalendarVisibility } from "@/lib/calendar/types";
import { parseCalendarRecurrenceInput } from "./parseCalendarRecurrenceInput";

export function parseCalendarFormData(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const imageEntry = formData.get("image");
  const image = imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;
  const isAllDay = formData.get("all_day") === "true" || formData.get("all_day") === "on";
  const recurrence = parseCalendarRecurrenceInput(formData);

  return {
    titleAr: get("title_ar"),
    titleEn: get("title_en") || null,
    description: get("description") || null,
    category: (get("category") || "event") as CalendarCategory,
    startsAt: get("starts_at"),
    endsAt: get("ends_at"),
    allDay: isAllDay,
    visibility: (get("visibility") || "internal") as CalendarVisibility,
    location: get("location") || null,
    image,
    ...recurrence,
  };
}
