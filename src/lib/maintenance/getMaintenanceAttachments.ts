import { createSupabaseServerClient } from "@/lib/supabase";
import type { MaintenanceAttachmentRow } from "./types";

export async function getMaintenanceAttachments(
  requestId: string,
): Promise<MaintenanceAttachmentRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("maintenance_attachments")
    .select("id, request_id, school_id, kind, path, mime, size_bytes, uploaded_by, created_at")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  const items: MaintenanceAttachmentRow[] = [];
  for (const item of data) {
    const { data: signed } = await supabase.storage
      .from("maintenance-photos")
      .createSignedUrl(item.path, 3600);

    items.push({
      ...item,
      public_url: signed?.signedUrl ?? undefined,
    });
  }

  return items;
}
