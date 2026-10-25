import type { SupabaseClient } from "@supabase/supabase-js";

export async function assignUserRole(
  supabase: SupabaseClient,
  userId: string,
  schoolId: string,
  assignedBy: string,
  roleKey: string,
): Promise<void> {
  const { data: roles, error: roleError } = await supabase
    .from("roles")
    .select("id, school_id, is_system")
    .eq("key", roleKey)
    .or(`school_id.eq.${schoolId},school_id.is.null`);

  if (roleError) {
    throw new Error(`Failed to resolve role '${roleKey}': ${roleError.message}`);
  }

  // Prefer school-scoped custom role over global system role
  const role =
    roles?.find((r) => r.school_id === schoolId) ?? roles?.find((r) => r.school_id === null);

  if (!role) {
    throw new Error(`Role '${roleKey}' was not found for school '${schoolId}'`);
  }

  const { data: existingAssignment, error: findError } = await supabase
    .from("user_role_assignments")
    .select("id")
    .eq("user_id", userId)
    .eq("school_id", schoolId)
    .maybeSingle();

  if (findError) {
    throw new Error(`Failed to check existing role assignment: ${findError.message}`);
  }

  if (existingAssignment) {
    const { error: updateError } = await supabase
      .from("user_role_assignments")
      .update({ role_id: role.id, assigned_by: assignedBy })
      .eq("id", existingAssignment.id);

    if (updateError) {
      throw new Error(`Failed to update user role assignment: ${updateError.message}`);
    }
  } else {
    const { error: insertError } = await supabase.from("user_role_assignments").insert({
      user_id: userId,
      role_id: role.id,
      school_id: schoolId,
      assigned_by: assignedBy,
    });

    if (insertError) {
      throw new Error(`Failed to insert user role assignment: ${insertError.message}`);
    }
  }
}
