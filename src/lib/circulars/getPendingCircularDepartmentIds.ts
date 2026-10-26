import type { SupabaseClient } from "@supabase/supabase-js";

export async function getPendingCircularDepartmentIds(
  supabase: SupabaseClient,
  circularId: string,
): Promise<string[]> {
  const [{ data: targets }, { data: responses }] = await Promise.all([
    supabase.from("circular_targets").select("department_id").eq("circular_id", circularId),
    supabase
      .from("circular_responses")
      .select("department_id, status")
      .eq("circular_id", circularId)
      .eq("is_latest", true),
  ]);

  const targetDeptIds = (targets ?? []).map((t) => t.department_id).filter(Boolean) as string[];
  const respondedDeptIds = new Set(
    (responses ?? [])
      .filter((r) => r.status === "acknowledged" || r.status === "approved")
      .map((r) => r.department_id),
  );

  return targetDeptIds.filter((id) => !respondedDeptIds.has(id));
}
