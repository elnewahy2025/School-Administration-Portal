import type { SupabaseClient } from "@supabase/supabase-js";
import { markEntityNotificationsRead } from "@/lib/notifications/markEntityNotificationsRead";

export async function markCircularNotificationReadIfPresent(
  supabase: SupabaseClient,
  userId: string | undefined,
  circularId: string,
): Promise<void> {
  if (!userId) {
    return;
  }
  await markEntityNotificationsRead(supabase, {
    userId,
    entityType: "circular",
    entityId: circularId,
  });
}
