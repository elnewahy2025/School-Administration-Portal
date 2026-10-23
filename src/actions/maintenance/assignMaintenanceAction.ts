"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseMaintenanceAssignData } from "@/lib/validation/parseMaintenanceAssignData";
import { saveMaintenanceAssignment } from "@/lib/maintenance/saveMaintenanceAssignment";

export async function assignMaintenanceAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("maintenance.assign", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const { requestId, operatorId, priority, notes } = parseMaintenanceAssignData(formData);
  if (!requestId || !operatorId) {
    return { success: false, error: "Request ID and Operator are required" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: ticket } = await supabase
    .from("maintenance_requests")
    .select("id, school_id, status, priority, assigned_operator_id")
    .eq("id", requestId)
    .single();

  if (!ticket) {
    return { success: false, error: "Ticket not found" };
  }

  const res = await saveMaintenanceAssignment(supabase, {
    requestId,
    schoolId: profile.school_id,
    operatorId,
    assignedBy: profile.id,
    currentStatus: ticket.status,
    currentOperatorId: ticket.assigned_operator_id,
    priority,
    currentPriority: ticket.priority,
    notes,
  });

  if (res.error) return { success: false, error: res.error };

  revalidatePath("/[locale]/maintenance", "page");
  revalidatePath(`/[locale]/maintenance/${requestId}`, "page");
  return { success: true };
}
