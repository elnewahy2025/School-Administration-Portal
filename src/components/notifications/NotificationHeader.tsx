"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n";
import { toast } from "sonner";
import { CheckCheckIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showConfirmBox } from "@/lib/feedback/showConfirmBox";
import { markAllNotificationsReadAction } from "@/actions/notifications/markAllNotificationsReadAction";
import { deleteAllNotificationsAction } from "@/actions/notifications/deleteAllNotificationsAction";

export function NotificationHeader({
  unreadCount,
  totalCount = 0,
}: {
  unreadCount: number;
  totalCount?: number;
}) {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMarkAll = () => {
    startTransition(async () => {
      const res = await markAllNotificationsReadAction();
      if (res.success) {
        toast.success(tCommon("saved"));
        router.refresh();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  const handleDeleteAll = async () => {
    const confirmed = await showConfirmBox({
      message: t("confirmDeleteAll"),
      type: "warning",
    });
    if (!confirmed) return;
    startTransition(async () => {
      const res = await deleteAllNotificationsAction();
      if (res.success) {
        toast.success(tCommon("deleted"));
        router.refresh();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {t("unreadCount", { count: unreadCount })}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAll}
            disabled={isPending}
            className="gap-2"
          >
            <CheckCheckIcon className="size-4" />
            <span>{t("markAllRead")}</span>
          </Button>
        )}
        {totalCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAll}
            disabled={isPending}
            className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2Icon className="size-4" />
            <span>{t("deleteAll")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
