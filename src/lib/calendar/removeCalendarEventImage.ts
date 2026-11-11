import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function removeCalendarEventImage(
  supabase: SupabaseClient,
  imagePath: string,
  actorId: string,
): Promise<void> {
  const { error: storageError } = await supabase.storage.from("public-assets").remove([imagePath]);

  if (storageError) {
    const admin = createSupabaseAdminClient({
      actorId,
      actorLabel: "delete-calendar-image-fallback",
    });
    await admin.storage.from("public-assets").remove([imagePath]);
  }
}
