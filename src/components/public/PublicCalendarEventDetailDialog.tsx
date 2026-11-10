"use client";

import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDrawerEscape } from "@/components/layout/useDrawerEscape";
import type { UnifiedCalendarItem } from "@/lib/calendar/types";
import { resolvePublicCalendarItemDetails } from "./resolvePublicCalendarItemDetails";
import { formatPublicEventDateTime } from "./formatPublicEventDateTime";
import { PublicCalendarEventModalBody } from "./PublicCalendarEventModalBody";

export function PublicCalendarEventDetailDialog({
  item,
  isOpen,
  locale,
  onClose,
}: {
  item: UnifiedCalendarItem | null;
  isOpen: boolean;
  locale: string;
  onClose: () => void;
}) {
  const tCal = useTranslations("calendar");
  const tCommon = useTranslations("common");

  useDrawerEscape(onClose, isOpen && Boolean(item));

  if (!isOpen || !item || item.kind !== "event") return null;

  const event = item.event;
  const { title, location, categoryLabel, pillClass } = resolvePublicCalendarItemDetails(
    item,
    locale,
  );
  const { formattedDate, timeRange } = formatPublicEventDateTime(
    event,
    locale,
    tCal("allDayBadge"),
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-card">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="space-y-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${pillClass}`}
            >
              {categoryLabel}
            </span>
            <h2 className="font-heading text-xl font-extrabold text-[#0c1f44] sm:text-2xl dark:text-white">
              {title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={tCommon("close")}
          >
            <XIcon className="size-5" />
          </Button>
        </div>

        <PublicCalendarEventModalBody
          event={event}
          title={title}
          location={location}
          formattedDate={formattedDate}
          timeRange={timeRange}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
