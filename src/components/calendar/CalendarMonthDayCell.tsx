"use client";

import { CalendarDayItemList } from "./CalendarDayItemList";
import type { UnifiedCalendarItem } from "@/lib/calendar/types";

type CalendarMonthDayCellProps = {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend?: boolean;
  dayItems: UnifiedCalendarItem[];
  onSelectItem?: (item: UnifiedCalendarItem) => void;
};

export function CalendarMonthDayCell({
  day,
  isCurrentMonth,
  isToday,
  isWeekend,
  dayItems,
  onSelectItem,
}: CalendarMonthDayCellProps) {
  const bgClass = !isCurrentMonth
    ? "bg-muted/20 text-muted-foreground/40"
    : isWeekend
      ? "bg-muted/15 text-muted-foreground/80 dark:bg-muted/10"
      : "bg-card";

  return (
    <div
      title={isWeekend && isCurrentMonth ? "Official Weekend / عطلة رسمية" : undefined}
      className={`min-h-[90px] border-e border-b border-border p-1.5 transition ${bgClass}`}
    >
      <div className="mb-1 flex items-center justify-between">
        {isWeekend && isCurrentMonth ? (
          <span className="text-[10px] font-medium text-amber-600/70 dark:text-amber-400/70">
            •
          </span>
        ) : (
          <span />
        )}

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
