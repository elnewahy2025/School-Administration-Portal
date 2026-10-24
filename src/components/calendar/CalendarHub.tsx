"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarEventsView } from "./CalendarEventsView";
import type { CalendarEventRow } from "@/lib/calendar/types";
import type { CircularRow } from "@/lib/circulars/types";

export function CalendarHub({
  events,
  circulars = [],
  canManageEvents = false,
}: {
  events: CalendarEventRow[];
  circulars?: CircularRow[];
  canManageEvents?: boolean;
}) {
  const t = useTranslations("calendar");
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        {canManageEvents && (
          <Link href={`/${locale}/calendar/new`}>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              <span>{t("newEvent")}</span>
            </Button>
          </Link>
        )}
      </div>

      <CalendarEventsView events={events} circulars={circulars} canManage={canManageEvents} />
    </div>
  );
}
