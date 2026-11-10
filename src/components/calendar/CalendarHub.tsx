"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { CalendarEventsView } from "./CalendarEventsView";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarHub({
  events,
  canManageEvents = false,
}: {
  events: CalendarEventRow[];
  canManageEvents?: boolean;
}) {
  const t = useTranslations("calendar");
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        subtitle={t("description")}
        action={
          canManageEvents ? (
            <Link href={`/${locale}/calendar/new`}>
              <Button className="gap-2">
                <PlusIcon className="size-4" />
                <span>{t("newEvent")}</span>
              </Button>
            </Link>
          ) : null
        }
      />

      <CalendarEventsView events={events} canManage={canManageEvents} />
    </div>
  );
}
