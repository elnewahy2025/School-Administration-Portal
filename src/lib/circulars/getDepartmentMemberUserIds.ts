import type { SupabaseClient } from "@supabase/supabase-js";

export async function getDepartmentMemberUserIds(
  supabase: SupabaseClient,
  schoolId: string,
  departmentIds: string[],
): Promise<string[]> {
  if (!departmentIds.length) return [];

  const { data: users } = await supabase
    .from("profiles")
    .select("id")
    .eq("school_id", schoolId)
    .eq("is_active", true)
    .in("department_id", departmentIds);

  return (users ?? []).map((u) => u.id as string);
}
