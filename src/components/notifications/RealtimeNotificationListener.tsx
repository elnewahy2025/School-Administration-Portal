"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/createSupabaseBrowserClient";
import { resolveNotificationHref } from "@/lib/notifications/resolveNotificationHref";
import { resolveNotificationText } from "@/lib/notifications/resolveNotificationText";
import type { NotificationRow } from "@/lib/notifications/types";

export function RealtimeNotificationListener({ userId }: { userId: string }) {
  const router = useRouter();
  const t = useTranslations("notifications");

  useEffect(() => {
    if (!userId) return;

    const supabase = createSupabaseBrowserClient();
    const channelName = `realtime-notifications-${userId}`;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        void supabase.realtime.setAuth(session.access_token);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.access_token) {
          void supabase.realtime.setAuth(session.access_token);
        }
      },
    );

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
          const content = resolveNotificationText(row, t);

          toast.info(content.title, {
            description: content.body ?? undefined,
            action: href
              ? {
                  label: t("view"),
                  onClick: () => router.push(href),
                }
              : undefined,
          });

          router.refresh();
        },
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("[realtime] subscription error:", err);
        }
      });

    return () => {
      authListener?.subscription?.unsubscribe();
      void supabase.removeChannel(channel);
    };
  }, [userId, router, t]);

  return null;
}
