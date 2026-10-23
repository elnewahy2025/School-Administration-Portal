import type { SupabaseClient } from "@supabase/supabase-js";
import type { CircularPriority, CircularResponseType } from "./types";

export async function createCircularRecord(
  supabase: SupabaseClient,
  params: {
    schoolId: string;
    title: string;
    body: string;
    priority: CircularPriority;
    responseType: CircularResponseType;
    dueAt: string | null;
    createdBy: string;
  },
): Promise<{ circularId?: string; error?: string }> {
  const { data: refNum, error: refError } = await supabase.rpc("generate_school_number", {
    p_school: params.schoolId,
    p_kind: "circular",
  });

  if (refError) return { error: refError.message };
  if (!refNum) return { error: "Failed to generate reference number" };

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

  if (error) return { error: error.message };
  if (!data) return { error: "Failed to create circular" };

  return { circularId: data.id };
}
