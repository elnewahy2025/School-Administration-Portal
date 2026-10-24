"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function deleteRoleAction(roleId: string) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("roles.manage", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: role } = await supabase
    .from("roles")
    .select("id, is_system, school_id")
    .eq("id", roleId)
    .single();

  if (!role || role.is_system || role.school_id !== profile.school_id) {
    return { success: false, error: "Cannot delete system or unauthorized roles" };
  }

  const { data: assignments } = await supabase
    .from("user_role_assignments")
    .select("id")
    .eq("role_id", roleId)
    .limit(1);

  if (assignments && assignments.length > 0) {
    return { success: false, error: "Cannot delete role assigned to active users" };
  }

  const { error } = await supabase.from("roles").delete().eq("id", roleId);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/settings/users", "page");
  return { success: true };
}
