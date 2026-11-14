import type { SupabaseClient } from "@supabase/supabase-js";
import { dispatchModuleNotification } from "@/lib/notifications/dispatchModuleNotification";
import { getCircularPublishRecipients } from "./getCircularPublishRecipients";

export async function dispatchCircularNotification(
  supabase: SupabaseClient,
  params: {
    schoolId: string;
    circularId: string;
    publisherId?: string | null;
  },
): Promise<{ delivered: number }> {
  const recipientUserIds = await getCircularPublishRecipients(
    supabase,
    params.schoolId,
    params.circularId,
    params.publisherId,
  );

  if (!recipientUserIds.length) {
    return { delivered: 0 };
  }

  const { delivered } = await dispatchModuleNotification({
    recipientUserIds,
    schoolId: params.schoolId,
    type: "circular",
    title: "circular_published",
    body: "circular_published",
    entityType: "circular",
    entityId: params.circularId,
  });

  return { delivered };
}
