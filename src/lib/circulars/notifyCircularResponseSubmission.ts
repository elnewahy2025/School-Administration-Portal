import type { SupabaseClient } from "@supabase/supabase-js";
import { dispatchModuleNotification } from "@/lib/notifications/dispatchModuleNotification";
import { getSchoolAdminUserIds } from "@/lib/school/getSchoolAdminUserIds";
import { fetchCircularBaseRow } from "./fetchCircularBaseRow";

export async function notifyCircularResponseSubmission(
  supabase: SupabaseClient,
  params: {
    circularId: string;
    schoolId: string;
    responderId: string;
  },
): Promise<{ delivered: number }> {
  const [circular, adminIds, targetsRes, responsesRes] = await Promise.all([
    fetchCircularBaseRow(supabase, params.circularId),
    getSchoolAdminUserIds(supabase, params.schoolId),
    supabase.from("circular_targets").select("department_id").eq("circular_id", params.circularId),
    supabase
      .from("circular_responses")
      .select("department_id")
      .eq("circular_id", params.circularId)
      .eq("is_latest", true),
  ]);

  const recipientIds = Array.from(
    new Set([circular?.created_by, ...adminIds].filter((id): id is string => Boolean(id))),
  ).filter((id) => id !== params.responderId);

  if (!recipientIds.length) {
    return { delivered: 0 };
  }

  const targets = (targetsRes.data ?? [])
    .map((t) => t.department_id)
    .filter((id): id is string => Boolean(id));
  const respondedDepts = new Set(
    (responsesRes.data ?? []).map((r) => r.department_id).filter((id): id is string => Boolean(id)),
  );

  const allResponded = targets.length > 0 && targets.every((deptId) => respondedDepts.has(deptId));

  const templateKey = allResponded ? "circular_all_responded" : "circular_response_received";

  return dispatchModuleNotification({
    recipientUserIds: recipientIds,
    schoolId: params.schoolId,
    type: "circular",
    title: templateKey,
    body: templateKey,
    entityType: "circular",
    entityId: params.circularId,
    skipThrottle: true,
  });
}
