import { createSupabaseServerClient } from "@/lib/supabase";

export async function getUserRoleKey(
  userId?: string | null,
  schoolId?: string | null,
): Promise<string | null> {
  if (!userId) return null;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("user_role_assignments")
    .select("roles!inner(key)")
    .eq("user_id", userId);

  if (schoolId) {
    query = query.eq("school_id", schoolId);
  }

  const { data } = await query.limit(1).maybeSingle();
  const role = data?.roles as unknown as { key: string } | null;
  return role?.key ?? null;
}
