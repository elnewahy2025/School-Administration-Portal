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
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function initSubscription() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session?.access_token) {
          await supabase.realtime.setAuth(session.access_token);
        }

        if (!isMounted) return;

        channel = supabase
          .channel(channelName)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
            },
            (payload) => {
              const row = payload.new as NotificationRow;
              if (!row || (row.user_id && row.user_id !== userId)) return;

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
            console.log("[Realtime] channel status:", status, err ?? "");
            if (err) {
              console.error("[Realtime] subscription error:", err);
            }
          });
      } catch (err) {
        console.error("[realtime] init failed:", err);
      }
    }

    void initSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        void supabase.realtime.setAuth(session.access_token);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [userId, router, t]);

  return null;
}
