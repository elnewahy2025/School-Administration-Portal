"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n";
import { toast } from "sonner";
import { showConfirmBox } from "@/lib/feedback/showConfirmBox";
import { markNotificationReadAction } from "@/actions/notifications/markNotificationReadAction";
import { deleteNotificationAction } from "@/actions/notifications/deleteNotificationAction";

export function useNotificationItemActions(notificationId: string) {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = () => {
    startTransition(async () => {
      const res = await markNotificationReadAction(notificationId);
      if (res.success) {
        toast.success(tCommon("saved"));
        router.refresh();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  const handleDelete = async () => {
    const confirmed = await showConfirmBox({
      message: t("confirmDelete"),
      type: "warning",
    });
    if (!confirmed) return;
    startTransition(async () => {
      const res = await deleteNotificationAction(notificationId);
      if (res.success) {
        toast.success(tCommon("deleted"));
        router.refresh();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return { isPending, handleMarkRead, handleDelete };
}

