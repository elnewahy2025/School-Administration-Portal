import type { SupabaseClient } from "@supabase/supabase-js";
import { logError } from "@/lib/logger";

export async function getSchoolAdminUserIds(
  supabase: SupabaseClient,
  schoolId: string,
): Promise<string[]> {
  const { data: adminRows, error } = await supabase
    .from("user_role_assignments")
    .select(
      "user_id, profiles!user_role_assignments_user_id_fkey!inner(is_active), roles!inner(key)",
    )
    .or(`school_id.eq.${schoolId},school_id.is.null`)
    .in("roles.key", ["school_admin", "owner"])
    .eq("profiles.is_active", true);

  if (error) {
    logError(error, { scope: "getSchoolAdminUserIds", schoolId });
    return [];
  }

  if (!adminRows) return [];
  return Array.from(new Set(adminRows.map((r) => r.user_id as string)));
}
