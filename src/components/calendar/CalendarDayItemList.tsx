"use client";

import { useLocale } from "next-intl";
import type { UnifiedCalendarItem } from "@/lib/calendar/types";

export function CalendarDayItemList({
  dayItems,
  onSelectItem,
}: {
  dayItems: UnifiedCalendarItem[];
  onSelectItem?: (item: UnifiedCalendarItem) => void;
}) {
  const locale = useLocale();

  return (
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
        <button
          type="button"
          onClick={() => onSelectItem?.(dayItems[3])}
          className="block ps-1 text-[10px] text-muted-foreground hover:text-foreground hover:underline"
        >
          +{dayItems.length - 3} more
        </button>
      )}
    </div>
  );
}
