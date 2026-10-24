"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarMonthGrid } from "./CalendarMonthGrid";
import type { UnifiedCalendarItem } from "@/lib/calendar/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarMonthView({
  items,
  onSelectItem,
}: {
  items: UnifiedCalendarItem[];
  onSelectItem?: (item: UnifiedCalendarItem) => void;
}) {
  const locale = useLocale();
  const t = useTranslations("calendar");
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const prevMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const monthLabel = currentDate.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4 overflow-hidden rounded-lg border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">{monthLabel}</h2>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={goToday}>
            {t("today")}
          </Button>
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRightIcon className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border pb-2 text-center text-xs font-semibold text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <CalendarMonthGrid currentDate={currentDate} items={items} onSelectItem={onSelectItem} />
    </div>
  );
}
