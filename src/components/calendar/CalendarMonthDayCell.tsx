"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarMonthDayCell({
  day,
  isCurrentMonth,
  isToday,
  dayEvents,
}: {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayEvents: CalendarEventRow[];
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
        {dayEvents.slice(0, 3).map((ev) => {
          const title = locale === "ar" ? ev.title_ar : ev.title_en || ev.title_ar;
          return (
            <Link
              key={ev.id}
              href={`/${locale}/calendar/${ev.id}`}
              className="block truncate rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20"
            >
              {title}
            </Link>
          );
        })}
        {dayEvents.length > 3 && (
          <span className="block ps-1 text-[10px] text-muted-foreground">
            +{dayEvents.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
