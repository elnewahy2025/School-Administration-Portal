"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { deleteAchievementRecord } from "@/lib/achievements/deleteAchievementRecord";

export async function deleteAchievementAction(achievementId: string) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("calendar.manage", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const res = await deleteAchievementRecord(supabase, achievementId, profile.school_id);

  if (res.error) {
    return { success: false, error: res.error };
  }

  revalidatePath("/[locale]/calendar", "page");
  revalidatePath("/[locale]", "page");
  return { success: true };
}
