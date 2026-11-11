"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { deleteCalendarEventAction } from "@/actions/calendar/deleteCalendarEventAction";
import { showConfirmBox } from "@/lib/feedback/showConfirmBox";

export function useDeleteCalendarEvent({
  eventId,
  redirectTo,
  onDeleted,
}: {
  eventId: string;
  redirectTo?: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("calendar.actions");
  const tCommon = useTranslations("common");
  const [isDeleting, startTransition] = useTransition();

  const confirmAndDelete = async () => {
    const confirmed = await showConfirmBox({
      message: t("confirmDelete"),
      type: "warning",
    });
    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteCalendarEventAction(eventId);
      if (res.success) {
        toast.success(t("deletedSuccess"));
        onDeleted?.();
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      } else {
        toast.error(res.error || tCommon("error"));
      }
    });
  };

  return { confirmAndDelete, isDeleting };
}
