"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { assignUserRole } from "@/lib/school/assignUserRole";
import { prepareUserProfilePayload } from "@/lib/school/prepareUserProfilePayload";

export async function updateUserAction(
  userId: string,
  fullName: string,
  jobTitle: string | null,
  departmentId: string | null,
  roleKey: string | null,
) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  if (await isPlatformOwner(userId)) {
    return { success: false, error: "Cannot modify platform owner" };
  }

  if (roleKey === "owner") {
    return { success: false, error: "Cannot assign platform owner role" };
  }

  const allowed = await hasPermission("users.manage", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const payload = prepareUserProfilePayload(fullName, jobTitle, departmentId);
  if (!payload.full_name) {
    return { success: false, error: "Full name is required" };
  }

  const supabase = await createSupabaseServerClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .eq("school_id", profile.school_id);

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  if (roleKey) {
    await assignUserRole(supabase, userId, profile.school_id, profile.id, roleKey);
  }

  revalidatePath("/[locale]/settings/users", "page");
  return { success: true };
}
