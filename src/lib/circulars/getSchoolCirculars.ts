import { createSupabaseServerClient } from "@/lib/supabase";
import type { CircularRow } from "./types";

export async function getSchoolCirculars(schoolId?: string | null): Promise<CircularRow[]> {
  if (!schoolId) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("circulars")
    .select(
      "id, school_id, ref_number, title, body, category, priority, status, response_type, response_instructions, allow_response_revision, publish_at, due_at, created_by, closed_at, created_at",
    )
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch circulars: ${error.message}`);
  }

  return (data as CircularRow[]) ?? [];
}
