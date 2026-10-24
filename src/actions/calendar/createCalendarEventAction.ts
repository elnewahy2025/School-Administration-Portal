"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { assertCanManageCalendar } from "@/lib/calendar/assertCanManageCalendar";
import { parseCalendarFormData } from "@/lib/validation/parseCalendarFormData";
import { assertValidCalendarInput } from "@/lib/calendar/assertValidCalendarInput";
import { createCalendarEventRecord } from "@/lib/calendar/createCalendarEventRecord";
import { uploadCalendarImage } from "@/lib/calendar/uploadCalendarImage";
import { ValidationError } from "@/lib/errors/ValidationError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";
import { AppError } from "@/lib/errors/AppError";

export async function createCalendarEventAction(
  formData: FormData,
): Promise<ActionResult<{ eventId: string }>> {
  try {
    const auth = await assertCanManageCalendar();
    const data = parseCalendarFormData(formData);
    const validationError = assertValidCalendarInput(data);
    if (validationError) {
      throw new ValidationError(validationError);
    }

    const supabase = await createSupabaseServerClient();
    let imagePath: string | null = null;

    if (data.image) {
      const uploadRes = await uploadCalendarImage(supabase, data.image, auth.schoolId);
      if (uploadRes.error) {
        throw new AppError(uploadRes.error);
      }
      imagePath = uploadRes.path ?? null;
    }

    const res = await createCalendarEventRecord(supabase, {
      schoolId: auth.schoolId,
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
      createdBy: auth.profileId,
    });

    if (res.error) {
      throw new AppError(res.error);
    }
    if (!res.eventId) {
      throw new AppError("Failed to create calendar event");
    }

    revalidatePath("/[locale]/calendar", "page");
    revalidatePath("/[locale]", "page");
    return { success: true, eventId: res.eventId };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
