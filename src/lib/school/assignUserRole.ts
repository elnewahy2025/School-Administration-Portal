import type { SupabaseClient } from "@supabase/supabase-js";

export async function assignUserRole(
  supabase: SupabaseClient,
  userId: string,
  schoolId: string,
  assignedBy: string,
  roleKey: string,
) {
  const { data: role } = await supabase.from("roles").select("id").eq("key", roleKey).maybeSingle();

  if (!role) return;

  const { data: existingAssignment } = await supabase
    .from("user_role_assignments")
    .select("id")
    .eq("user_id", userId)
    .eq("school_id", schoolId)
    .maybeSingle();

  if (existingAssignment) {
    await supabase
      .from("user_role_assignments")
      .update({ role_id: role.id, assigned_by: assignedBy })
      .eq("id", existingAssignment.id);
  } else {
    await supabase.from("user_role_assignments").insert({
      user_id: userId,
      role_id: role.id,
      school_id: schoolId,
      assigned_by: assignedBy,
    });
  }
}
