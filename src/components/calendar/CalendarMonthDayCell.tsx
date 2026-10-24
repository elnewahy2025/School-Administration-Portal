"use client";

import { useLocale } from "next-intl";
import type { UnifiedCalendarItem } from "@/lib/calendar/types";

export function CalendarMonthDayCell({
  day,
  isCurrentMonth,
  isToday,
  dayItems,
  onSelectItem,
}: {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayItems: UnifiedCalendarItem[];
  onSelectItem?: (item: UnifiedCalendarItem) => void;
}) {
  const locale = useLocale();

  return (
    <div
      className={`min-h-[90px] border-e border-b border-border p-1.5 transition ${
        isCurrentMonth ? "bg-card" : "bg-muted/20 text-muted-foreground/50"
      }`}
    >
      <div className="mb-1 flex justify-end">
        <span
          className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
            isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {day}
        </span>
      </div>

      <div className="space-y-1">
        {dayItems.slice(0, 3).map((item) => {
          const isEvent = item.kind === "event";
          const title = isEvent
            ? locale === "ar"
              ? item.event.title_ar
              : item.event.title_en || item.event.title_ar
            : item.circular.title;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem?.(item)}
              title={title}
              className={`block w-full truncate rounded px-1.5 py-0.5 text-start text-[10px] font-medium transition ${
                isEvent
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 dark:text-indigo-300"
              }`}
            >
              <span className="me-1 opacity-70">{isEvent ? "•" : "📋"}</span>
              {title}
            </button>
          );
        })}
        {dayItems.length > 3 && (
          <span className="block ps-1 text-[10px] text-muted-foreground">
            +{dayItems.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
