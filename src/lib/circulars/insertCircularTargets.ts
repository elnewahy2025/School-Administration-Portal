import type { SupabaseClient } from "@supabase/supabase-js";

export async function insertCircularTargets(
  supabase: SupabaseClient,
  circularId: string,
  schoolId: string,
  departmentIds: string[],
) {
  if (departmentIds.length === 0) return;
  const targets = departmentIds.map((deptId) => ({
    circular_id: circularId,
    school_id: schoolId,
    department_id: deptId,
  }));
  await supabase.from("circular_targets").insert(targets);
}
