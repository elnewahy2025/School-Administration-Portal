"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n";
import { CheckIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "./NotificationBadge";
import { resolveNotificationHref } from "@/lib/notifications/resolveNotificationHref";
import { resolveNotificationText } from "@/lib/notifications/resolveNotificationText";
import { useNotificationItemActions } from "./useNotificationItemActions";
import type { NotificationRow } from "@/lib/notifications/types";

export function NotificationItem({ notification }: { notification: NotificationRow }) {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const { isPending, handleMarkRead, handleDelete } = useNotificationItemActions(notification.id);

  const isUnread = !notification.read_at;
  const href = resolveNotificationHref(notification);
  const content = resolveNotificationText(notification, t);
  const formattedDate = new Date(notification.created_at).toLocaleString(
    locale === "ar" ? "ar-EG" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );

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
          {isUnread && <span className="size-2 rounded-full bg-primary" aria-label={t("unread")} />}
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <h4 className="text-sm font-semibold text-foreground">{content.title}</h4>
        {content.body && (
          <p className="text-xs leading-relaxed text-muted-foreground">{content.body}</p>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="gap-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={t("delete")}
        >
          <Trash2Icon className="size-3.5" />
          <span className="hidden sm:inline">{t("delete")}</span>
        </Button>
      </div>
    </div>
  );
}
