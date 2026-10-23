"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { isLegalTransition } from "@/lib/maintenance/isLegalTransition";
import { parseMaintenanceTransitionData } from "@/lib/validation/parseMaintenanceTransitionData";
import { insertMaintenanceUpdate } from "@/lib/maintenance/insertMaintenanceUpdate";
import { handleOptionalPhoto } from "@/lib/maintenance/handleOptionalPhoto";
import { assertCanTransitionStatus } from "@/lib/maintenance/assertCanTransitionStatus";
import { buildStatusUpdatePayload } from "@/lib/maintenance/buildStatusUpdatePayload";

export async function updateMaintenanceStatusAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const { requestId, targetStatus, reason, evidencePhoto } =
    parseMaintenanceTransitionData(formData);
  if (!requestId || !targetStatus) {
    return { success: false, error: "Invalid status transition request" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: ticket } = await supabase
    .from("maintenance_requests")
    .select("id, school_id, status, reporter_id, assigned_operator_id")
    .eq("id", requestId)
    .single();

  if (!ticket) return { success: false, error: "Ticket not found" };

  if (!isLegalTransition(ticket.status, targetStatus)) {
    return { success: false, error: `Illegal transition from ${ticket.status} to ${targetStatus}` };
  }

  const canAssign = await hasPermission("maintenance.assign", profile.school_id);
  const canClose = await hasPermission("maintenance.close", profile.school_id);
  const authCheck = assertCanTransitionStatus({
    targetStatus,
    isReporter: ticket.reporter_id === profile.id,
    isAssigned: ticket.assigned_operator_id === profile.id,
    canAssign,
    canClose,
    reason,
  });
  if (!authCheck.ok) return { success: false, error: authCheck.error };

  await handleOptionalPhoto(supabase, evidencePhoto, {
    schoolId: profile.school_id,
    requestId,
    uploadedBy: profile.id,
    kind: "evidence",
  });

  const updatePayload = buildStatusUpdatePayload({ targetStatus, userId: profile.id, reason });
  const { error: updateError } = await supabase
    .from("maintenance_requests")
    .update(updatePayload)
    .eq("id", requestId);

  if (updateError) return { success: false, error: updateError.message };

  await insertMaintenanceUpdate(supabase, {
    requestId,
    schoolId: profile.school_id,
    authorId: profile.id,
    kind: "status_change",
    oldValue: ticket.status,
    newValue: targetStatus,
    reason,
  });

  revalidatePath("/[locale]/maintenance", "page");
  revalidatePath(`/[locale]/maintenance/${requestId}`, "page");
  return { success: true };
}
