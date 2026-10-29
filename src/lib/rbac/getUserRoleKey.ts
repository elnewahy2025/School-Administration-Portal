import { createSupabaseAdminClient } from "@/lib/supabase";

export async function getUserRoleKey(
  userId?: string | null,
  schoolId?: string | null,
): Promise<string | null> {
  if (!userId) return null;

  const admin = createSupabaseAdminClient();
  let query = admin.from("user_role_assignments").select("roles!inner(key)").eq("user_id", userId);

  if (schoolId) {
    query = query.or(`school_id.eq.${schoolId},school_id.is.null`);
  }

  const { data } = await query.limit(1).maybeSingle();
  const role = data?.roles as unknown as { key: string } | null;
  return role?.key ?? null;
}
