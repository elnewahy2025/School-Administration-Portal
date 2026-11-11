"use client";

import { createPortal } from "react-dom";
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
  if (typeof document === "undefined") return null;

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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl dark:border-slate-800 dark:bg-card">
        <div className="shrink-0 border-b border-slate-100 bg-white/95 px-5 py-4 sm:px-6 sm:pt-6 sm:pb-4 backdrop-blur-xs dark:border-slate-800 dark:bg-card/95">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${pillClass}`}
              >
                {categoryLabel}
              </span>
              <h2 className="font-heading text-lg font-extrabold text-[#0c1f44] sm:text-2xl dark:text-white break-words">
                {title}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={tCommon("close")}
            >
              <XIcon className="size-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto overscroll-contain p-5 sm:p-6">
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
    </div>,
    document.body,
  );
}
