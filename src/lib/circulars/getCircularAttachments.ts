import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";
import type { CircularAttachmentRow } from "./types";

export async function getCircularAttachments(circularId: string): Promise<CircularAttachmentRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("circular_attachments")
    .select("id, circular_id, school_id, path, mime, size_bytes, uploaded_by, created_at")
    .eq("circular_id", circularId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  const adminClient = createSupabaseAdminClient();
  const items: CircularAttachmentRow[] = [];
  for (const item of data) {
    const { data: signed } = await adminClient.storage
      .from("circular-attachments")
      .createSignedUrl(item.path, 86400);

    items.push({
      ...(item as CircularAttachmentRow),
      public_url: signed?.signedUrl ?? undefined,
    });
  }

  return items;
}
