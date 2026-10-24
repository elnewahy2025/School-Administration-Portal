import type { SupabaseClient } from "@supabase/supabase-js";

export async function assertCanDeleteRoleRecord(
  supabase: SupabaseClient,
  roleId: string,
  schoolId: string,
): Promise<{ allowed: boolean; error?: string }> {
  const { data: role } = await supabase
    .from("roles")
    .select("id, is_system, school_id")
    .eq("id", roleId)
    .single();

  if (!role || role.is_system || role.school_id !== schoolId) {
    return { allowed: false, error: "Cannot delete system or unauthorized roles" };
  }

  const { data: assignments } = await supabase
    .from("user_role_assignments")
    .select("id")
    .eq("role_id", roleId)
    .limit(1);

  if (assignments && assignments.length > 0) {
    return { allowed: false, error: "Cannot delete role assigned to active users" };
  }

  return { allowed: true };
}
