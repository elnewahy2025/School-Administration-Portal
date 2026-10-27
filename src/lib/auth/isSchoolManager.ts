import { createSupabaseAdminClient } from "@/lib/supabase";

export async function isSchoolManager(
  userId?: string | null,
  schoolId?: string | null,
): Promise<boolean> {
  if (!userId) return false;

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("user_role_assignments")
    .select("id, roles!inner(key)")
    .eq("user_id", userId)
    .eq("roles.key", "school_admin");

  if (schoolId) {
    query = query.or(`school_id.eq.${schoolId},school_id.is.null`);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error || !data) return false;
  return true;
}
