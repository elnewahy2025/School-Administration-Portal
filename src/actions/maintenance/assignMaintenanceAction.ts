"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { assertCanAssignMaintenance } from "@/lib/maintenance/assertCanAssignMaintenance";
import { isActiveSchoolMember } from "@/lib/school/isActiveSchoolMember";
import { parseMaintenanceAssignData } from "@/lib/validation/parseMaintenanceAssignData";
import { saveMaintenanceAssignment } from "@/lib/maintenance/saveMaintenanceAssignment";
import { dispatchModuleNotification } from "@/lib/notifications/dispatchModuleNotification";
import { ValidationError } from "@/lib/errors/ValidationError";
import { NotFoundError } from "@/lib/errors/NotFoundError";
import { AppError } from "@/lib/errors/AppError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function assignMaintenanceAction(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await assertCanAssignMaintenance();
    const { requestId, operatorId, priority, notes } = parseMaintenanceAssignData(formData);
    if (!requestId || !operatorId) {
      throw new ValidationError("Request ID and Operator are required");
    }

    const supabase = await createSupabaseServerClient();
    const { data: ticket } = await supabase
      .from("maintenance_requests")
      .select("id, school_id, status, priority, assigned_operator_id")
      .eq("id", requestId)
      .single();

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    if (ticket.school_id !== auth.schoolId) {
      // RLS already hides foreign tickets; this keeps the service-role side
      // effects below honest even if a policy regresses.
      throw new NotFoundError("Ticket not found");
    }

    // The operator id comes from the client. Reject a user from another
    // tenant before writing the assignment (audit finding M-8).
    if (!(await isActiveSchoolMember(supabase, operatorId, auth.schoolId))) {
      throw new ValidationError("The selected operator does not belong to this school");
    }

    const res = await saveMaintenanceAssignment(supabase, {
      requestId,
      schoolId: auth.schoolId,
      operatorId,
      assignedBy: auth.profileId,
      currentStatus: ticket.status,
      currentOperatorId: ticket.assigned_operator_id,
      priority,
      currentPriority: ticket.priority,
      notes,
    });

    if (res.error) {
      throw new AppError(res.error);
    }

    if (operatorId && operatorId !== auth.profileId) {
      void dispatchModuleNotification({
        recipientUserIds: [operatorId],
        schoolId: auth.schoolId,
        type: "maintenance",
        title: "تم إسناد بلاغ صيانة جديد لك",
        body: `تم إسناد البلاغ إليك للمتابعة والإنجاز`,
        entityType: "maintenance_request",
        entityId: requestId,
      });
    }

    revalidatePath("/[locale]/maintenance", "page");
    revalidatePath(`/[locale]/maintenance/${requestId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
