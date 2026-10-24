"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function deleteUserAction(userId: string) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  if (profile.id === userId) {
    return { success: false, error: "Cannot delete your own account" };
  }

  const allowed = await hasPermission("users.manage", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();

  // Delete role assignments for this user within this school
  await supabase
    .from("user_role_assignments")
    .delete()
    .eq("user_id", userId)
    .eq("school_id", profile.school_id);

  // Disassociate the user from the school and deactivate
  const { error } = await supabase
    .from("profiles")
    .update({
      school_id: null,
      department_id: null,
      is_active: false,
    })
    .eq("id", userId)
    .eq("school_id", profile.school_id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/settings/users", "page");
  return { success: true };
}
