"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarEventMetaFooter({ event }: { event: CalendarEventRow }) {
  const locale = useLocale();
  const t = useTranslations("calendar");
  const startDate = new Date(event.starts_at);
  const formattedDate = startDate.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = event.all_day
    ? t("allDayBadge")
    : startDate.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-border pt-2.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <CalendarIcon className="size-3.5 text-primary" />
        <span>{formattedDate}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ClockIcon className="size-3.5" />
        <span>{formattedTime}</span>
      </div>
      {event.location && (
        <div className="flex items-center gap-1.5">
          <MapPinIcon className="size-3.5" />
          <span>{event.location}</span>
        </div>
      )}
    </div>
  );
}
