"use client";

import { useTranslations } from "next-intl";
import { CalendarEventCategoryBadge } from "./CalendarEventCategoryBadge";
import { CalendarEventStatusBadge } from "./CalendarEventStatusBadge";
import { CalendarVisibilityBadge } from "./CalendarVisibilityBadge";
import { CalendarActionButtons } from "./CalendarActionButtons";
import { CalendarEventMetaGrid } from "./CalendarEventMetaGrid";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarEventDetailCard({
  event,
  canManage,
}: {
  event: CalendarEventRow;
  canManage: boolean;
}) {
  const t = useTranslations("calendar");

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{event.title_ar}</h1>
          {event.title_en && (
            <p className="mt-0.5 text-sm text-muted-foreground">{event.title_en}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CalendarEventCategoryBadge category={event.category} />
          <CalendarVisibilityBadge visibility={event.visibility} />
          <CalendarEventStatusBadge status={event.status} />
        </div>
      </div>

      {event.description && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("eventDescription")}
          </h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {event.description}
          </p>
        </div>
      )}

      <CalendarEventMetaGrid event={event} />

      {canManage && (
        <div className="flex justify-end border-t border-border pt-4">
          <CalendarActionButtons eventId={event.id} status={event.status} canManage={canManage} />
        </div>
      )}
    </div>
  );
}
