import type { SupabaseClient } from "@supabase/supabase-js";

export async function getRoleTargetMemberUserIds(
  supabase: SupabaseClient,
  schoolId: string,
  roleKeys: string[],
): Promise<string[]> {
  if (!roleKeys.length) return [];

  const { data: roleUsers, error: roleError } = await supabase
    .from("user_role_assignments")
    .select("user_id, roles!inner(key)")
    .eq("school_id", schoolId)
    .in("roles.key", roleKeys);

  if (roleError || !roleUsers) return [];
  return roleUsers.map((r) => r.user_id as string);
}
