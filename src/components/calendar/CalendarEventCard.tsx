"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react";
import { CalendarEventCategoryBadge } from "./CalendarEventCategoryBadge";
import { CalendarEventStatusBadge } from "./CalendarEventStatusBadge";
import { CalendarVisibilityBadge } from "./CalendarVisibilityBadge";
import { CalendarActionButtons } from "./CalendarActionButtons";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarEventCard({
  event,
  canManage,
}: {
  event: CalendarEventRow;
  canManage: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("calendar");
  const title = locale === "ar" ? event.title_ar : event.title_en || event.title_ar;
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
    <div className="space-y-3 rounded-lg border border-border bg-card p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CalendarEventCategoryBadge category={event.category} />
          <CalendarVisibilityBadge visibility={event.visibility} />
          <CalendarEventStatusBadge status={event.status} />
        </div>
        <CalendarActionButtons eventId={event.id} status={event.status} canManage={canManage} />
      </div>

      <div>
        <Link href={`/${locale}/calendar/${event.id}`} className="hover:underline">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </Link>
        {event.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{event.description}</p>
        )}
      </div>

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
    </div>
  );
}
