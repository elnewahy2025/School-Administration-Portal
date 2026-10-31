import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import type { CircularAttachmentRow } from "./types";

export async function getCircularAttachments(circularId: string): Promise<CircularAttachmentRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("circular_attachments")
    .select("id, circular_id, school_id, path, mime, size_bytes, uploaded_by, created_at")
    .eq("circular_id", circularId)
    .order("created_at", { ascending: true });

  if (error) {
    throw mapDatabaseError(error);
  }
  if (!data) {
    return [];
  }

  const adminClient = createSupabaseAdminClient();
  const items: CircularAttachmentRow[] = [];
  for (const item of data) {
    const { data: signed, error: signError } = await adminClient.storage
      .from("circular-attachments")
      .createSignedUrl(item.path, 86400);

    if (signError) {
      console.warn(`[StorageWarning] Failed to create signed URL for attachment ${item.id}: ${signError.message}`);
    }

    items.push({
      ...(item as CircularAttachmentRow),
      public_url: signed?.signedUrl ?? undefined,
    });
  }

  return items;
}
