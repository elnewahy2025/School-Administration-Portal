import { createSupabaseServerClient } from "@/lib/supabase";
import type { CircularRow } from "./types";

export async function getSchoolCirculars(schoolId?: string | null): Promise<CircularRow[]> {
  const supabase = await createSupabaseServerClient();
  let resolvedId = schoolId;
  if (!resolvedId) {
    const { data: firstSchool } = await supabase
      .from("schools")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    resolvedId = firstSchool?.id ?? null;
  }
  if (!resolvedId) return [];

  const { data, error } = await supabase
    .from("circulars")
    .select(
      "id, school_id, ref_number, title, body, category, priority, status, response_type, response_instructions, allow_response_revision, publish_at, due_at, created_by, closed_at, created_at",
    )
    .eq("school_id", resolvedId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch circulars: ${error.message}`);
  }

  return (data as CircularRow[]) ?? [];
}
