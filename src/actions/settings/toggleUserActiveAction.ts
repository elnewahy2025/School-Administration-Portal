"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function toggleUserActiveAction(targetUserId: string, currentStatus: boolean) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  if (profile.id === targetUserId) {
    return { success: false, error: "Cannot change your own active status" };
  }

  if (await isPlatformOwner(targetUserId)) {
    return { success: false, error: "Cannot modify platform owner" };
  }

  const allowed = await hasPermission("users.manage", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: !currentStatus })
    .eq("id", targetUserId)
    .eq("school_id", profile.school_id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/settings/users", "page");
  return { success: true };
}
