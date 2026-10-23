"use client";

import { useTranslations } from "next-intl";
import { CalendarIcon } from "lucide-react";
import { CalendarEventCard } from "./CalendarEventCard";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarListView({
  events,
  canManage,
}: {
  events: CalendarEventRow[];
  canManage: boolean;
}) {
  const t = useTranslations("calendar");

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <CalendarIcon className="mb-3 size-10 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">{t("noEvents")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {events.map((ev) => (
        <CalendarEventCard key={ev.id} event={ev} canManage={canManage} />
      ))}
    </div>
  );
}
