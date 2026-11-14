import type { SupabaseClient } from "@supabase/supabase-js";
import { logError } from "@/lib/logger";

export async function markEntityNotificationsRead(
  supabase: SupabaseClient,
  params: {
    userId: string;
    entityType: string;
    entityId: string;
  },
): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", params.userId)
    .eq("entity_type", params.entityType)
    .eq("entity_id", params.entityId)
    .is("read_at", null);

  if (error) {
    logError(error, { scope: "markEntityNotificationsRead", ...params });
  }
}
