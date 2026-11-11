import { isWeekendDay } from "./isWeekendDay";
import { validateClientFile } from "@/lib/storage/validateClientFile";
import { calendarImageRules } from "./calendarImageRules";

export function validateCalendarEventFormSubmission(
  formData: FormData,
  workingDays?: number[] | null,
): { valid: boolean; error?: string } {
  const startsAt = String(formData.get("starts_at") || "");
  const endsAt = String(formData.get("ends_at") || "");

  if (isWeekendDay(startsAt, workingDays) || isWeekendDay(endsAt, workingDays)) {
    return { valid: false, error: "weekendNotAllowed" };
  }

  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const fileValidation = validateClientFile(imageFile, {
      allowedMimes: calendarImageRules.allowedMime,
      maxBytes: calendarImageRules.maxBytes,
    });
    if (!fileValidation.valid) {
      return { valid: false, error: fileValidation.error };
    }
  }

  return { valid: true };
}
