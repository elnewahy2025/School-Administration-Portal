import { createSupabaseServerClient } from "@/lib/supabase";
import { getPublicDocumentUrl } from "./getPublicDocumentUrl";
import type { SchoolDocumentRow } from "./types";

export async function getPublicSchoolDocuments(
  schoolId?: string | null,
): Promise<SchoolDocumentRow[]> {
  if (!schoolId) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("school_documents")
    .select(
      `
      id,
      school_id,
      slug,
      title,
      description,
      file_path,
      file_name,
      file_size,
      mime_type,
      created_by,
      created_at,
      updated_at
    `,
    )
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((doc) => ({
    ...doc,
    file_url: getPublicDocumentUrl(doc.file_path),
  })) as SchoolDocumentRow[];
}
