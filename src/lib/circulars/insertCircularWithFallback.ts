import type { SupabaseClient } from "@supabase/supabase-js";
import type { CircularPriority, CircularResponseType, CircularVisibility } from "./types";
import { insertCircularWithoutVisibility } from "./insertCircularWithoutVisibility";

export type CircularInsertParams = {
  schoolId: string;
  title: string;
  body: string;
  priority: CircularPriority;
  visibility?: CircularVisibility;
  responseType: CircularResponseType;
  dueAt: string | null;
  createdBy: string;
};

export async function insertCircularWithFallback(
  supabase: SupabaseClient,
  params: CircularInsertParams,
  refNum: string,
): Promise<{ circularId?: string; error?: string }> {
  const insertPayload = {
    school_id: params.schoolId,
    ref_number: refNum,
    title: params.title,
    body: params.body,
    priority: params.priority,
    visibility: params.visibility ?? "internal",
    status: "draft",
    response_type: params.responseType,
    due_at: params.dueAt,
    created_by: params.createdBy,
  };

  const { data, error } = await supabase
    .from("circulars")
    .insert(insertPayload)
    .select("id")
    .single();

  if (data?.id) {
    return { circularId: data.id };
  }

  if (params.visibility === "public" && error?.code === "23514") {
    const retry = await supabase
      .from("circulars")
      .insert({ ...insertPayload, visibility: "all" })
      .select("id")
      .single();
    if (retry.data?.id) {
      return { circularId: retry.data.id };
    }
  }

  return insertCircularWithoutVisibility(supabase, params, refNum);
}
