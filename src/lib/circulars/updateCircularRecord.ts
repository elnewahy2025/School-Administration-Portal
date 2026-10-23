import type { SupabaseClient } from "@supabase/supabase-js";
import type { CircularPriority, CircularResponseType, CircularStatus } from "./types";
import { insertCircularTargets } from "./insertCircularTargets";

export async function updateCircularRecord(
  supabase: SupabaseClient,
  params: {
    circularId: string;
    schoolId: string;
    title: string;
    body: string;
    priority: CircularPriority;
    status?: CircularStatus;
    responseType: CircularResponseType;
    publishAt?: string | null;
    dueAt: string | null;
    departmentIds?: string[];
  },
): Promise<{ success: boolean; error?: string }> {
  const updatePayload: Record<string, unknown> = {
    title: params.title,
    body: params.body,
    priority: params.priority,
    response_type: params.responseType,
    due_at: params.dueAt,
    updated_at: new Date().toISOString(),
  };

  if (params.status) {
    updatePayload.status = params.status;
  }
  if (params.publishAt !== undefined) {
    updatePayload.publish_at = params.publishAt;
  }

  const { error } = await supabase
    .from("circulars")
    .update(updatePayload)
    .eq("id", params.circularId);

  if (error) return { success: false, error: error.message };

  if (params.departmentIds) {
    await supabase.from("circular_targets").delete().eq("circular_id", params.circularId);
    await insertCircularTargets(supabase, params.circularId, params.schoolId, params.departmentIds);
  }

  return { success: true };
}
