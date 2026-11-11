"use client";

import { useTranslations } from "next-intl";
import { SendIcon, BanIcon, ArchiveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalendarStatus } from "@/lib/calendar/types";

export function CalendarStatusTransitionButtons({
  status,
  isPending,
  onPublish,
  onCancel,
  onArchive,
}: {
  status: CalendarStatus;
  isPending: boolean;
  onPublish: () => void;
  onCancel: () => void;
  onArchive: () => void;
}) {
  const t = useTranslations("calendar.actions");

  if (status === "draft") {
    return (
      <Button
        size="sm"
        disabled={isPending}
        onClick={onPublish}
        className="gap-1.5 bg-success text-success-foreground"
      >
        <SendIcon className="size-3.5 rtl:rotate-180" />
        <span>{t("publish")}</span>
      </Button>
    );
  }

  if (status === "published") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={onCancel}
          className="gap-1.5 text-destructive"
        >
          <BanIcon className="size-3.5" />
          <span>{t("cancel")}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={onArchive}
          className="gap-1.5 text-muted-foreground"
        >
          <ArchiveIcon className="size-3.5" />
          <span>{t("archive")}</span>
        </Button>
      </>
    );
  }

  return null;
}
