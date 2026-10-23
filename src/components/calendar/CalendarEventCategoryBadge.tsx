"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { CalendarCategory } from "@/lib/calendar/types";

const CATEGORY_COLORS: Record<CalendarCategory, string> = {
  academic: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  exam: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  holiday: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  meeting: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  activity: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
  event: "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200",
  other: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
};

export function CalendarEventCategoryBadge({ category }: { category: CalendarCategory }) {
  const t = useTranslations("calendar.categories");
  const className = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other;

  return (
    <Badge variant="outline" className={`border-transparent font-medium ${className}`}>
      {t.has(category) ? t(category) : category}
    </Badge>
  );
}
