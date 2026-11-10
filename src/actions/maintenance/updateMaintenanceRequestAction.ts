"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getMaintenanceRequestById } from "@/lib/maintenance/getMaintenanceRequestById";
import { assertCanManageMaintenanceRequest } from "@/lib/maintenance/assertCanManageMaintenanceRequest";
import { validateUpdateMaintenanceInput } from "@/lib/maintenance/validateUpdateMaintenanceInput";
import { buildMaintenanceUpdatePayload } from "@/lib/maintenance/buildMaintenanceUpdatePayload";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { NotFoundError } from "@/lib/errors/NotFoundError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export interface UpdateMaintenanceRequestInput {
  requestId: string;
  title: string;
  description: string;
  category: string;
  priority?: string;
  locationId?: string | null;
  area?: string | null;
  assetRef?: string | null;
}

export async function updateMaintenanceRequestAction(
  input: UpdateMaintenanceRequestInput,
): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      throw new AuthenticationError("Authentication required");
    }

    const valid = validateUpdateMaintenanceInput(input);
    const ticket = await getMaintenanceRequestById(input.requestId);
    if (!ticket) {
      throw new NotFoundError("Maintenance request not found");
    }

    await assertCanManageMaintenanceRequest(profile, ticket, "update");

    const supabase = createSupabaseAdminClient({
      actorId: profile.id,
      actorLabel: "update-maintenance-request",
    });

    const updatePayload = buildMaintenanceUpdatePayload(input, valid);
    const { error: updateError } = await supabase
      .from("maintenance_requests")
      .update(updatePayload)
      .eq("id", input.requestId);

    if (updateError) {
      throw mapDatabaseError(updateError, "Failed to update maintenance request");
    }

    await supabase.from("maintenance_updates").insert({
      request_id: input.requestId,
      school_id: ticket.school_id,
      author_id: profile.id,
      kind: "note",
      reason: "Ticket details updated",
    });

    revalidatePath("/[locale]/maintenance", "page");
    revalidatePath(`/[locale]/maintenance/${input.requestId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
