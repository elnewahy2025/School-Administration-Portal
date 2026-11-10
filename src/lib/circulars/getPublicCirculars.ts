import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";
import type { CircularRow } from "./types";

const PUBLIC_CIRCULAR_SELECT = `
  id, school_id, ref_number, title, body, category, priority, status, visibility,
  response_type, response_instructions, allow_response_revision,
  publish_at, due_at, created_by, closed_at, created_at,
  attachments:circular_attachments(
    id, circular_id, school_id, path, mime, size_bytes, uploaded_by, created_at
  )
`;

/** Fetches published circulars that are marked as public for the public school portal. */
export async function getPublicCirculars(schoolId?: string | null): Promise<CircularRow[]> {
  if (!schoolId) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("circulars")
    .select(PUBLIC_CIRCULAR_SELECT)
    .eq("school_id", schoolId)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  let rows = (data as unknown as CircularRow[]) ?? [];

  if (rows.length === 0) {
    const admin = createSupabaseAdminClient();
    const adminRes = await admin
      .from("circulars")
      .select(PUBLIC_CIRCULAR_SELECT)
      .eq("school_id", schoolId)
      .eq("status", "published")
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    rows = (adminRes.data as unknown as CircularRow[]) ?? rows;
  }

  return rows;
}
