import type { SupabaseClient } from "@supabase/supabase-js";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";

export async function assertCanUpdateRoleRecord(
  supabase: SupabaseClient,
  roleId: string,
  schoolId: string,
): Promise<void> {
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("id, is_system, school_id")
    .eq("id", roleId)
    .maybeSingle();

  if (roleError) {
    throw mapDatabaseError(roleError);
  }

  if (!role || role.is_system || role.school_id !== schoolId) {
    throw new ForbiddenError("Cannot modify system or unauthorized roles");
  }
}

