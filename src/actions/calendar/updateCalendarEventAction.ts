"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseCalendarFormData } from "@/lib/validation/parseCalendarFormData";
import { assertValidCalendarInput } from "@/lib/calendar/assertValidCalendarInput";
import { updateCalendarEventRecord } from "@/lib/calendar/updateCalendarEventRecord";
import { uploadCalendarImage } from "@/lib/calendar/uploadCalendarImage";

export async function updateCalendarEventAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("calendar.manage", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const eventId = String(formData.get("event_id") || "");
  if (!eventId) {
    return { success: false, error: "Event ID is required" };
  }

  const data = parseCalendarFormData(formData);
  const validationError = assertValidCalendarInput(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createSupabaseServerClient();
  let imagePath: string | undefined = undefined;

  if (data.image) {
    const uploadRes = await uploadCalendarImage(supabase, data.image, profile.school_id);
    if (uploadRes.error) return { success: false, error: uploadRes.error };
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

  if (res.error) return { success: false, error: res.error };

  revalidatePath("/[locale]/calendar", "page");
  revalidatePath(`/[locale]/calendar/${eventId}`, "page");
  revalidatePath("/[locale]", "page");
  return { success: true };
}
