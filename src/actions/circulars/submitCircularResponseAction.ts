"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { validateCircularResponse } from "@/lib/validation/validateCircularResponse";
import type { CircularResponseStatus, CircularResponseType } from "@/lib/circulars/types";

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
}) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id || !profile.department_id) {
    return { success: false, error: "Must belong to a department to respond" };
  }

  const allowed = await hasPermission("circular.respond", profile.school_id, profile.department_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  if (!validateCircularResponse(status, reason)) {
    return { success: false, error: "Rejection reason is required" };
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
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/circulars", "page");
  revalidatePath(`/[locale]/circulars/${circularId}`, "page");
  return { success: true };
}
