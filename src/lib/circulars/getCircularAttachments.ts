import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { buildAttachmentSignedUrls } from "./buildAttachmentSignedUrls";
import type { CircularAttachmentRow } from "./types";

const ATTACHMENT_FIELDS =
  "id, circular_id, school_id, path, mime, size_bytes, uploaded_by, created_at";

export async function getCircularAttachments(circularId: string): Promise<CircularAttachmentRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("circular_attachments")
    .select(ATTACHMENT_FIELDS)
    .eq("circular_id", circularId)
    .order("created_at", { ascending: true });

  if (error) {
    throw mapDatabaseError(error);
  }

  let records = data;
  if (!records || records.length === 0) {
    const adminFallback = createSupabaseAdminClient();
    if (adminFallback?.from) {
      const adminRes = await adminFallback
        .from("circular_attachments")
        .select(ATTACHMENT_FIELDS)
        .eq("circular_id", circularId)
        .order("created_at", { ascending: true });
      records = adminRes?.data ?? records;
    }
  }

  if (!records || records.length === 0) {
    return [];
  }

  const paths = records.map((item) => item.path);
  const urlMap = await buildAttachmentSignedUrls(circularId, paths);

  return records.map((item) => ({
    ...(item as CircularAttachmentRow),
    public_url: urlMap.get(item.path),
  }));
}
