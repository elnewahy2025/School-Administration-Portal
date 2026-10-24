"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { assertCanManageCalendar } from "@/lib/calendar/assertCanManageCalendar";
import { parseCalendarFormData } from "@/lib/validation/parseCalendarFormData";
import { assertValidCalendarInput } from "@/lib/calendar/assertValidCalendarInput";
import { updateCalendarEventRecord } from "@/lib/calendar/updateCalendarEventRecord";
import { uploadCalendarImage } from "@/lib/calendar/uploadCalendarImage";
import { ValidationError } from "@/lib/errors/ValidationError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";
import { AppError } from "@/lib/errors/AppError";

export async function updateCalendarEventAction(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await assertCanManageCalendar();
    const eventId = String(formData.get("event_id") || "");
    if (!eventId) {
      throw new ValidationError("Event ID is required");
    }

    const data = parseCalendarFormData(formData);
    const validationError = assertValidCalendarInput(data);
    if (validationError) {
      throw new ValidationError(validationError);
    }

    const supabase = await createSupabaseServerClient();
    let imagePath: string | undefined = undefined;

    if (data.image) {
      const uploadRes = await uploadCalendarImage(supabase, data.image, auth.schoolId);
      if (uploadRes.error) {
        throw new AppError(uploadRes.error);
      }
      imagePath = uploadRes.path;
    }

    const res = await updateCalendarEventRecord(supabase, {
      eventId,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      description: data.description,
      category: data.category,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      allDay: data.allDay,
      visibility: data.visibility,
      location: data.location,
      imagePath,
    });

    if (res.error) {
      throw new AppError(res.error);
    }

    revalidatePath("/[locale]/calendar", "page");
    revalidatePath(`/[locale]/calendar/${eventId}`, "page");
    revalidatePath("/[locale]", "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
