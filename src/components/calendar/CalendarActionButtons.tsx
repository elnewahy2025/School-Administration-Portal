"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishCalendarEventAction } from "@/actions/calendar/publishCalendarEventAction";
import { cancelCalendarEventAction } from "@/actions/calendar/cancelCalendarEventAction";
import { archiveCalendarEventAction } from "@/actions/calendar/archiveCalendarEventAction";
import { CalendarStatusTransitionButtons } from "./CalendarStatusTransitionButtons";
import { useDeleteCalendarEvent } from "./useDeleteCalendarEvent";
import type { CalendarStatus } from "@/lib/calendar/types";

export function CalendarActionButtons({
  eventId,
  status,
  canManage,
  redirectToOnDelete,
}: {
  eventId: string;
  status: CalendarStatus;
  canManage: boolean;
  redirectToOnDelete?: string;
}) {
  const t = useTranslations("calendar.actions");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const { confirmAndDelete, isDeleting } = useDeleteCalendarEvent({
    eventId,
    redirectTo: redirectToOnDelete,
  });

  if (!canManage) return null;

  const executeAction = (action: (id: string) => Promise<{ success: boolean; error?: string }>) => {
    startTransition(async () => {
      const res = await action(eventId);
      if (res.success) toast.success(tCommon("saved"));
      else toast.error(res.error || tCommon("error"));
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "archived" && (
        <Link href={`/${locale}/calendar/${eventId}/edit`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <PencilIcon className="size-3.5" />
            <span>{t("edit")}</span>
          </Button>
        </Link>
      )}

      <CalendarStatusTransitionButtons
        status={status}
        isPending={isPending}
        onPublish={() => executeAction(publishCalendarEventAction)}
        onCancel={() => executeAction(cancelCalendarEventAction)}
        onArchive={() => executeAction(archiveCalendarEventAction)}
      />

      <Button
        variant="outline"
        size="sm"
        disabled={isDeleting}
        onClick={confirmAndDelete}
        className="gap-1.5 text-destructive hover:bg-destructive/10"
      >
        <Trash2Icon className="size-3.5" />
        <span>{t("delete")}</span>
      </Button>
    </div>
  );
}
