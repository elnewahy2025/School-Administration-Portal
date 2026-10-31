import { createSupabaseServerClient } from "@/lib/supabase";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import type { CircularRow } from "./types";

export async function getSchoolCirculars(schoolId?: string | null): Promise<CircularRow[]> {
  if (!schoolId) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("circulars")
    .select(
      `
      id, school_id, ref_number, title, body, category, priority, status, visibility,
      response_type, response_instructions, allow_response_revision,
      publish_at, due_at, created_by, closed_at, created_at,
      targets:circular_targets(
        id, department_id, role_key,
        departments(id, name_ar, name_en)
      ),
      attachments:circular_attachments(
        id, circular_id, school_id, path, mime, size_bytes, uploaded_by, created_at
      )
    `,
    )
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });

  if (error) {
    throw mapDatabaseError(error);
  }

  return (data as unknown as CircularRow[]) ?? [];
}
