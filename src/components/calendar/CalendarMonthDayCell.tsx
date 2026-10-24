"use client";

import { CalendarDayItemList } from "./CalendarDayItemList";
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
  return (
    <div
      className={`min-h-[90px] border-e border-b border-border p-1.5 transition ${
        isCurrentMonth ? "bg-card" : "bg-muted/20 text-muted-foreground/50"
      }`}
    >
      <div className="mb-1 flex justify-end">
        {dayItems.length > 0 ? (
          <button
            type="button"
            onClick={() => onSelectItem?.(dayItems[0])}
            title={`View ${dayItems.length} item(s)`}
            className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold transition hover:scale-105 ${
              isToday
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {day}
          </button>
        ) : (
          <span
            className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
              isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {day}
          </span>
        )}
      </div>

      <CalendarDayItemList dayItems={dayItems} onSelectItem={onSelectItem} />
    </div>
  );
}
