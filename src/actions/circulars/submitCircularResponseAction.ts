"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { validateCircularResponse } from "@/lib/validation/validateCircularResponse";
import type { CircularResponseStatus, CircularResponseType } from "@/lib/circulars/types";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
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
    if (!profile?.school_id || !profile.department_id) {
      throw new AuthenticationError("Must belong to a department to respond");
    }

    const allowed = await hasPermission(
      "circular.respond",
      profile.school_id,
      profile.department_id,
    );
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    if (!validateCircularResponse(status, reason)) {
      throw new ValidationError("Rejection reason is required");
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("circular_responses")
      .update({ is_latest: false })
      .eq("circular_id", circularId)
      .eq("department_id", profile.department_id);

    const { error } = await supabase.from("circular_responses").insert({
      circular_id: circularId,
      school_id: profile.school_id,
      department_id: profile.department_id,
      responder_id: profile.id,
      response_type: responseType,
      status,
      reason: reason?.trim() || null,
      is_latest: true,
    });

    if (error) {
      throw mapDatabaseError(error);
    }

    revalidatePath("/[locale]/circulars", "page");
    revalidatePath(`/[locale]/circulars/${circularId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
