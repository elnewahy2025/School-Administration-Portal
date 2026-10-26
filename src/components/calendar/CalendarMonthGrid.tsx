"use client";

import { CalendarMonthDayCell } from "./CalendarMonthDayCell";
import type { UnifiedCalendarItem } from "@/lib/calendar/types";

type CalendarMonthGridProps = {
  currentDate: Date;
  items: UnifiedCalendarItem[];
  onSelectItem?: (item: UnifiedCalendarItem) => void;
};

export function CalendarMonthGrid({
  currentDate,
  items,
  onSelectItem,
}: CalendarMonthGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    const isWeekend = i % 7 === 5 || i % 7 === 6;
    cells.push({
      day: 0,
      isCurrentMonth: false,
      isToday: false,
      isWeekend,
      dayItems: [] as UnifiedCalendarItem[],
    });
  }

  for (let d = 1; d <= totalDays; d++) {
    const isToday =
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const dayOfWeek = (firstDayIndex + d - 1) % 7;
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    const dayItems = items.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === year && itemDate.getMonth() === month && itemDate.getDate() === d
      );
    });

    cells.push({ day: d, isCurrentMonth: true, isToday, isWeekend, dayItems });
  }

  return (
    <div className="grid grid-cols-7 border-s border-t border-border">
      {cells.map((cell, idx) => (
        <CalendarMonthDayCell
          key={idx}
          day={cell.day}
          isCurrentMonth={cell.isCurrentMonth}
          isToday={cell.isToday}
          isWeekend={cell.isWeekend}
          dayItems={cell.dayItems}
          onSelectItem={onSelectItem}
        />
      ))}
    </div>
  );
}
