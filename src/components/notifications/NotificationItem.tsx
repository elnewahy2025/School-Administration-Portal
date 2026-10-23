"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n";
import { CheckIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "./NotificationBadge";
import { resolveNotificationHref } from "@/lib/notifications/resolveNotificationHref";
import { markNotificationReadAction } from "@/actions/notifications/markNotificationReadAction";
import type { NotificationRow } from "@/lib/notifications/types";

export function NotificationItem({ notification }: { notification: NotificationRow }) {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const isUnread = !notification.read_at;
  const href = resolveNotificationHref(notification);
  const formattedDate = new Date(notification.created_at).toLocaleString(
    locale === "ar" ? "ar-EG" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );

  const handleMarkRead = () => {
    startTransition(async () => {
      await markNotificationReadAction(notification.id);
    });
  };

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
        isUnread
          ? "border-primary/40 bg-primary/5 shadow-xs"
          : "border-border bg-card hover:bg-muted/40"
      }`}
    >
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <NotificationBadge type={notification.type} />
          {isUnread && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
        {notification.body && (
          <p className="text-xs leading-relaxed text-muted-foreground">{notification.body}</p>
        )}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {isUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkRead}
            disabled={isPending}
            className="gap-1 text-xs"
          >
            <CheckIcon className="size-3.5" />
            <span>{t("markRead")}</span>
          </Button>
        )}
        {href && (
          <Link href={href}>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <span>{t("viewDetails")}</span>
              <ExternalLinkIcon className="size-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
