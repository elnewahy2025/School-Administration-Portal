import type { SupabaseClient } from "@supabase/supabase-js";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { getDepartmentMemberUserIds } from "./getDepartmentMemberUserIds";
import { getPendingCircularDepartmentIds } from "./getPendingCircularDepartmentIds";

export async function getCircularReminderRecipients({
  supabase,
  schoolId,
  circularId,
  targetType,
  customUserIds = [],
}: {
  supabase: SupabaseClient;
  schoolId: string;
  circularId?: string | null;
  targetType: "pending" | "all" | "custom";
  customUserIds?: string[];
}): Promise<string[]> {
  if (targetType === "custom") {
    return customUserIds.filter(Boolean);
  }

  if (targetType === "all") {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("school_id", schoolId)
      .eq("is_active", true);

    if (error) {
      throw mapDatabaseError(error);
    }

    return (data ?? []).map((p) => p.id as string);
  }

  if (circularId) {
    const pendingDeptIds = await getPendingCircularDepartmentIds(supabase, circularId);
    return getDepartmentMemberUserIds(supabase, schoolId, pendingDeptIds);
  }

  const { data: activeTargets, error: targetsError } = await supabase
    .from("circular_targets")
    .select("department_id, circular:circulars!inner(school_id, status)")
    .eq("circular.school_id", schoolId)
    .in("circular.status", ["published", "in_progress"]);

  if (targetsError) {
    throw mapDatabaseError(targetsError);
  }

  const deptIds = Array.from(
    new Set((activeTargets ?? []).map((t) => t.department_id).filter(Boolean)),
  ) as string[];

  return getDepartmentMemberUserIds(supabase, schoolId, deptIds);
}
