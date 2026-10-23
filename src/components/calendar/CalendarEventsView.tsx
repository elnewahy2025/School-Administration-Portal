"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarDaysIcon, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarListView } from "./CalendarListView";
import type { CalendarEventRow, CalendarCategory } from "@/lib/calendar/types";

export function CalendarEventsView({
  events,
  canManage,
}: {
  events: CalendarEventRow[];
  canManage: boolean;
}) {
  const t = useTranslations("calendar");
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === "all") return true;
    return ev.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["all", "academic", "exam", "holiday", "meeting", "event"].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all" ? t("title") : t(`categories.${cat as CalendarCategory}`)}
            </Button>
          ))}
        </div>

        <div className="flex items-center rounded-lg border border-border bg-muted/40 p-1">
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="gap-1.5"
          >
            <CalendarDaysIcon className="size-4" />
            <span>{t("monthView")}</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-1.5"
          >
            <ListIcon className="size-4" />
            <span>{t("listView")}</span>
          </Button>
        </div>
      </div>

      {viewMode === "month" ? (
        <CalendarMonthView events={filteredEvents} />
      ) : (
        <CalendarListView events={filteredEvents} canManage={canManage} />
      )}
    </div>
  );
}
