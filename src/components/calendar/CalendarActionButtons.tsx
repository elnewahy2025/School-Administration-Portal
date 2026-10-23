"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SendIcon, BanIcon, ArchiveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishCalendarEventAction } from "@/actions/calendar/publishCalendarEventAction";
import { cancelCalendarEventAction } from "@/actions/calendar/cancelCalendarEventAction";
import { archiveCalendarEventAction } from "@/actions/calendar/archiveCalendarEventAction";
import type { CalendarStatus } from "@/lib/calendar/types";

export function CalendarActionButtons({
  eventId,
  status,
  canManage,
}: {
  eventId: string;
  status: CalendarStatus;
  canManage: boolean;
}) {
  const t = useTranslations("calendar.actions");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  if (!canManage) return null;

  const handlePublish = () => {
    startTransition(async () => {
      const res = await publishCalendarEventAction(eventId);
      if (res.success) toast.success(tCommon("saved"));
      else toast.error(res.error || tCommon("error"));
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelCalendarEventAction(eventId);
      if (res.success) toast.success(tCommon("saved"));
      else toast.error(res.error || tCommon("error"));
    });
  };

  const handleArchive = () => {
    startTransition(async () => {
      const res = await archiveCalendarEventAction(eventId);
      if (res.success) toast.success(tCommon("saved"));
      else toast.error(res.error || tCommon("error"));
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "draft" && (
        <Button
          size="sm"
          disabled={isPending}
          onClick={handlePublish}
          className="gap-1.5 bg-emerald-600 text-white"
        >
          <SendIcon className="size-3.5 rtl:rotate-180" />
          <span>{t("publish")}</span>
        </Button>
      )}

      {status === "published" && (
        <>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleCancel}
            className="gap-1.5 text-destructive"
          >
            <BanIcon className="size-3.5" />
            <span>{t("cancel")}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleArchive}
            className="gap-1.5 text-muted-foreground"
          >
            <ArchiveIcon className="size-3.5" />
            <span>{t("archive")}</span>
          </Button>
        </>
      )}
    </div>
  );
}
