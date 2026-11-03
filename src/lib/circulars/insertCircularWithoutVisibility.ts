import type { SupabaseClient } from "@supabase/supabase-js";
import type { CircularInsertParams } from "./insertCircularWithFallback";

export async function insertCircularWithoutVisibility(
  supabase: SupabaseClient,
  params: CircularInsertParams,
  refNum: string,
): Promise<{ circularId?: string; error?: string }> {
  const { data, error } = await supabase
    .from("circulars")
    .insert({
      school_id: params.schoolId,
      ref_number: refNum,
      title: params.title,
      body: params.body,
      priority: params.priority,
      status: "draft",
      response_type: params.responseType,
      due_at: params.dueAt,
      created_by: params.createdBy,
    })
    .select("id")
    .single();

  if (data?.id) {
    return { circularId: data.id };
  }

  return { error: error?.message ?? "Failed to create circular" };
}
