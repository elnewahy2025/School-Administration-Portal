import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function removeCalendarEventImage(
  supabase: SupabaseClient,
  imagePath: string,
  actorId: string,
): Promise<void> {
  if (!imagePath || typeof imagePath !== "string") return;

  let normalized = imagePath.trim().replace(/^\/+/, "");
  if (normalized.startsWith("public-assets/")) {
    normalized = normalized.replace(/^public-assets\//, "");
  }
  if (!normalized) return;

  const { data, error: storageError } = await supabase.storage
    .from("public-assets")
    .remove([normalized]);

  // Supabase Storage returns `{ data: [], error: null }` when RLS suppresses the deletion.
  // Fall back to the privileged service-role admin client whenever no objects were deleted or an error occurred.
  if (storageError || !data || data.length === 0) {
    const admin = createSupabaseAdminClient({
      actorId,
      actorLabel: "delete-calendar-image-fallback",
    });
    await admin.storage.from("public-assets").remove([normalized]);
  }
}
