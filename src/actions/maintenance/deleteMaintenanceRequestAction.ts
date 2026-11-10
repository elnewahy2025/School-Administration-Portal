"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getMaintenanceRequestById } from "@/lib/maintenance/getMaintenanceRequestById";
import { assertCanManageMaintenanceRequest } from "@/lib/maintenance/assertCanManageMaintenanceRequest";
import { deleteMaintenanceRequestRecord } from "@/lib/maintenance/deleteMaintenanceRequestRecord";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { NotFoundError } from "@/lib/errors/NotFoundError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function deleteMaintenanceRequestAction(requestId: string): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      throw new AuthenticationError("Authentication required");
    }

    const ticket = await getMaintenanceRequestById(requestId);
    if (!ticket) {
      throw new NotFoundError("Maintenance request not found");
    }

    await assertCanManageMaintenanceRequest(profile, ticket, "delete");

    const supabase = createSupabaseAdminClient({
      actorId: profile.id,
      actorLabel: "delete-maintenance-request",
    });

    const res = await deleteMaintenanceRequestRecord(supabase, requestId);
    if (!res.success) {
      throw mapDatabaseError(res.error, "Failed to delete maintenance request");
    }

    revalidatePath("/[locale]/maintenance", "page");
    revalidatePath(`/[locale]/maintenance/${requestId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
