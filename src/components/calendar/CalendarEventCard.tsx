"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { CalendarEventCategoryBadge } from "./CalendarEventCategoryBadge";
import { CalendarEventStatusBadge } from "./CalendarEventStatusBadge";
import { CalendarVisibilityBadge } from "./CalendarVisibilityBadge";
import { CalendarActionButtons } from "./CalendarActionButtons";
import { CalendarEventMetaFooter } from "./CalendarEventMetaFooter";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarEventCard({
  event,
  canManage,
  onSelect,
}: {
  event: CalendarEventRow;
  canManage: boolean;
  onSelect?: () => void;
}) {
  const locale = useLocale();
  const title = locale === "ar" ? event.title_ar : event.title_en || event.title_ar;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CalendarEventCategoryBadge category={event.category} />
          <CalendarVisibilityBadge visibility={event.visibility} />
          <CalendarEventStatusBadge status={event.status} />
        </div>
        <div className="flex items-center gap-1.5">
          {onSelect && (
            <button
              type="button"
              onClick={onSelect}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Details
            </button>
          )}
          <CalendarActionButtons eventId={event.id} status={event.status} canManage={canManage} />
        </div>
      </div>

      <div>
        {onSelect ? (
          <button
            type="button"
            onClick={onSelect}
            className="text-start font-semibold text-foreground hover:underline"
          >
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </button>
        ) : (
          <Link href={`/${locale}/calendar/${event.id}`} className="hover:underline">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </Link>
        )}
        {event.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{event.description}</p>
        )}
      </div>

      <CalendarEventMetaFooter event={event} />
    </div>
  );
}
