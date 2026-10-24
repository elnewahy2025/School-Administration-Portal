"use client";

import { useTranslations } from "next-intl";
import { FileTextIcon, WrenchIcon, CalendarDaysIcon } from "lucide-react";

export function PublicHeroCapabilities() {
  const t = useTranslations("home");

  return (
    <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
        <FileTextIcon className="size-3.5 text-primary" />
        <span>{t("moduleCirculars")}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
        <WrenchIcon className="size-3.5 text-amber-500" />
        <span>{t("moduleMaintenance")}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
        <CalendarDaysIcon className="size-3.5 text-blue-500" />
        <span>{t("moduleCalendar")}</span>
      </span>
    </div>
  );
}
