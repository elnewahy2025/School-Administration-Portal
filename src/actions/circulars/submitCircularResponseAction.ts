"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { assertCanRespondToCircular } from "@/lib/circulars/assertCanRespondToCircular";
import { validateCircularResponse } from "@/lib/validation/validateCircularResponse";
import type { CircularResponseStatus, CircularResponseType } from "@/lib/circulars/types";
import { ValidationError } from "@/lib/errors/ValidationError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function submitCircularResponseAction({
  circularId,
  responseType,
  status,
  reason,
}: {
  circularId: string;
  responseType: CircularResponseType;
  status: CircularResponseStatus;
  reason?: string | null;
}): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    const { schoolId, departmentId } = await assertCanRespondToCircular(profile);

    if (!validateCircularResponse(status, reason)) {
      throw new ValidationError("Rejection reason is required");
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.rpc("submit_circular_response", {
      p_circular_id: circularId,
      p_school_id: schoolId,
      p_department_id: departmentId,
      p_response_type: responseType,
      p_status: status,
      p_reason: reason?.trim() || null,
    });

    if (error) {
      throw mapDatabaseError(error, error.message || "Failed to submit circular response");
    }

    revalidatePath("/[locale]/circulars", "page");
    revalidatePath(`/[locale]/circulars/${circularId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
