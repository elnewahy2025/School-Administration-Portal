"use client";

import { CalendarMonthDayCell } from "./CalendarMonthDayCell";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarMonthGrid({
  currentDate,
  events,
}: {
  currentDate: Date;
  events: CalendarEventRow[];
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ day: 0, isCurrentMonth: false, isToday: false, dayEvents: [] });
  }

  for (let d = 1; d <= totalDays; d++) {
    const isToday =
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

    const dayEvents = events.filter((ev) => {
      const evDate = new Date(ev.starts_at);
      return evDate.getFullYear() === year && evDate.getMonth() === month && evDate.getDate() === d;
    });

    cells.push({ day: d, isCurrentMonth: true, isToday, dayEvents });
  }

  return (
    <div className="grid grid-cols-7 border-s border-t border-border">
      {cells.map((cell, idx) => (
        <CalendarMonthDayCell
          key={idx}
          day={cell.day}
          isCurrentMonth={cell.isCurrentMonth}
          isToday={cell.isToday}
          dayEvents={cell.dayEvents}
        />
      ))}
    </div>
  );
}
