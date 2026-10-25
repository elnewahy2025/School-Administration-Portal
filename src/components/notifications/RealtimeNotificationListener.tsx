"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/createSupabaseBrowserClient";
import { resolveNotificationHref } from "@/lib/notifications/resolveNotificationHref";
import type { NotificationRow } from "@/lib/notifications/types";

export function RealtimeNotificationListener({ userId }: { userId: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("notifications");

  useEffect(() => {
    if (!userId) return;

    const supabase = createSupabaseBrowserClient();
    const channelName = `realtime-notifications-${userId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          const href = resolveNotificationHref(row);

          toast.info(row.title, {
            description: row.body ?? undefined,
            action: href
              ? {
                  label: t("view"),
                  onClick: () => router.push(`/${locale}${href}`),
                }
              : undefined,
          });

          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, locale, router, t]);

  return null;
}
