import type { SupabaseClient } from "@supabase/supabase-js";
import { buildStatusUpdatePayload } from "./buildStatusUpdatePayload";
import { handleOptionalPhoto } from "./handleOptionalPhoto";
import { insertMaintenanceUpdate } from "./insertMaintenanceUpdate";
import { mapDatabaseError } from "../errors/mapDatabaseError";
import type { MaintenanceStatus } from "./types";

export async function applyMaintenanceStatusChange(
  supabase: SupabaseClient,
  params: {
    requestId: string;
    schoolId: string;
    userId: string;
    targetStatus: string;
    oldStatus: string;
    reason?: string | null;
    evidencePhoto?: File | null;
  },
): Promise<void> {
  const { requestId, schoolId, userId, targetStatus, oldStatus, reason, evidencePhoto } = params;

  await handleOptionalPhoto(supabase, evidencePhoto ?? null, {
    schoolId,
    requestId,
    uploadedBy: userId,
    kind: "evidence",
  });

  const updatePayload = buildStatusUpdatePayload({
    targetStatus: targetStatus as MaintenanceStatus,
    userId,
    reason,
  });
  const { error: updateError } = await supabase
    .from("maintenance_requests")
    .update(updatePayload)
    .eq("id", requestId);

  if (updateError) {
    throw mapDatabaseError(updateError);
  }

  await insertMaintenanceUpdate(supabase, {
    requestId,
    schoolId,
    authorId: userId,
    kind: "status_change",
    oldValue: oldStatus,
    newValue: targetStatus,
    reason,
  });
}
