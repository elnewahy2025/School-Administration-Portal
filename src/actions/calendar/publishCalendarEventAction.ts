"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function publishCalendarEventAction(eventId: string) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("calendar.manage", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("calendar_events")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)
    .eq("school_id", profile.school_id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/[locale]/calendar", "page");
  revalidatePath(`/[locale]/calendar/${eventId}`, "page");
  revalidatePath("/[locale]", "page");
  return { success: true };
}
