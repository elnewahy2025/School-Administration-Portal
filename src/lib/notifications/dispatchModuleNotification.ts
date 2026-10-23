import { createSupabaseAdminClient } from "@/lib/supabase";
import { createNotificationRecord } from "./createNotificationRecord";
import type { NotificationType, NotificationEntityKind } from "./types";

export async function dispatchModuleNotification({
  recipientUserIds,
  schoolId,
  type,
  title,
  body,
  entityType,
  entityId,
}: {
  recipientUserIds: string[];
  schoolId?: string | null;
  type: NotificationType;
  title: string;
  body?: string | null;
  entityType?: NotificationEntityKind | null;
  entityId?: string | null;
}) {
  if (!recipientUserIds.length) return;
  const adminClient = createSupabaseAdminClient();

  const uniqueUserIds = Array.from(new Set(recipientUserIds));
  await Promise.allSettled(
    uniqueUserIds.map((userId) =>
      createNotificationRecord(adminClient, {
        userId,
        schoolId,
        type,
        title,
        body,
        entityType,
        entityId,
      }),
    ),
  );
}
