import type { SupabaseClient } from "@supabase/supabase-js";

export async function deleteCircularRecord(
  supabase: SupabaseClient,
  circularId: string,
): Promise<{ success: boolean; error?: string }> {
  // First fetch attachments to clean up storage
  const { data: attachments } = await supabase
    .from("circular_attachments")
    .select("path")
    .eq("circular_id", circularId);

  if (attachments && attachments.length > 0) {
    const paths = attachments.map((a) => a.path);
    await supabase.storage.from("circular-attachments").remove(paths);
  }

  const { error } = await supabase.from("circulars").delete().eq("id", circularId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
