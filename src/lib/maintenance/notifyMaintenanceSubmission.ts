import type { SupabaseClient } from "@supabase/supabase-js";
import { dispatchModuleNotification } from "@/lib/notifications/dispatchModuleNotification";
import { getSchoolAdminUserIds } from "@/lib/school/getSchoolAdminUserIds";

export async function notifyMaintenanceSubmission(
  supabase: SupabaseClient,
  params: {
    schoolId: string;
    requestId: string;
    reporterId: string;
  },
): Promise<{ delivered: number }> {
  const adminIds = await getSchoolAdminUserIds(supabase, params.schoolId);
  const notifyUserIds = adminIds.filter((id) => id !== params.reporterId);

  if (!notifyUserIds.length) {
    return { delivered: 0 };
  }

  return dispatchModuleNotification({
    recipientUserIds: notifyUserIds,
    schoolId: params.schoolId,
    type: "maintenance",
    title: "maintenance_submitted",
    body: "maintenance_submitted",
    entityType: "maintenance_request",
    entityId: params.requestId,
    skipThrottle: true,
  });
}
