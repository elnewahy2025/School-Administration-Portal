import type { SupabaseClient } from "@supabase/supabase-js";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { getDepartmentMemberUserIds } from "./getDepartmentMemberUserIds";
import { getSchoolWideCircularRecipients } from "./getSchoolWideCircularRecipients";
import { getRoleTargetMemberUserIds } from "./getRoleTargetMemberUserIds";

export async function getCircularPublishRecipients(
  supabase: SupabaseClient,
  schoolId: string,
  circularId: string,
  publisherId?: string | null,
): Promise<string[]> {
  const { data: targets, error: targetsError } = await supabase
    .from("circular_targets")
    .select("department_id, role_key, department:departments(head_profile_id)")
    .eq("circular_id", circularId);

  if (targetsError) {
    throw mapDatabaseError(targetsError);
  }

  if (!targets || targets.length === 0) {
    const allMembers = await getSchoolWideCircularRecipients(supabase, schoolId);
    return allMembers.filter((id) => !publisherId || id !== publisherId);
  }

  const departmentIds = targets
    .map((t) => t.department_id)
    .filter((id): id is string => Boolean(id));

  type TargetHead = { department: { head_profile_id: string | null } | null };
  const headIds = (targets as unknown as TargetHead[])
    .map((t) => t.department?.head_profile_id)
    .filter((id): id is string => Boolean(id));

  const roleKeys = targets.map((t) => t.role_key).filter((k): k is string => Boolean(k));

  const [memberIds, roleUserIds] = await Promise.all([
    getDepartmentMemberUserIds(supabase, schoolId, departmentIds),
    getRoleTargetMemberUserIds(supabase, schoolId, roleKeys),
  ]);

  const combined = Array.from(new Set([...memberIds, ...headIds, ...roleUserIds]));
  return combined.filter((id) => !publisherId || id !== publisherId);
}
