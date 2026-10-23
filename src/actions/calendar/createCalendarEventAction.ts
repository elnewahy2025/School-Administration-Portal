"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseCalendarFormData } from "@/lib/validation/parseCalendarFormData";
import { assertValidCalendarInput } from "@/lib/calendar/assertValidCalendarInput";
import { createCalendarEventRecord } from "@/lib/calendar/createCalendarEventRecord";
import { uploadCalendarImage } from "@/lib/calendar/uploadCalendarImage";

export async function createCalendarEventAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("calendar.manage", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const data = parseCalendarFormData(formData);
  const validationError = assertValidCalendarInput(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createSupabaseServerClient();
  let imagePath: string | null = null;

  if (data.image) {
    const uploadRes = await uploadCalendarImage(supabase, data.image, profile.school_id);
    if (uploadRes.error) return { success: false, error: uploadRes.error };
    imagePath = uploadRes.path ?? null;
  }

  const res = await createCalendarEventRecord(supabase, {
    schoolId: profile.school_id,
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
    createdBy: profile.id,
  });

  if (res.error) {
    return { success: false, error: res.error };
  }
  if (!res.eventId) {
    return { success: false, error: "Failed to create calendar event" };
  }

  revalidatePath("/[locale]/calendar", "page");
  revalidatePath("/[locale]", "page");
  return { success: true, eventId: res.eventId };
}
