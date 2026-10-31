"use client";

import { useTranslations } from "next-intl";
import { FileTextIcon, WrenchIcon, CalendarDaysIcon } from "lucide-react";

export function PublicHeroCapabilities() {
  const t = useTranslations("home");

  return (
    <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm sm:text-base text-foreground font-semibold animate-hero-fade-up delay-600">
      <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/85 px-5 sm:px-6 py-3 shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-info/50 hover:bg-card hover:-translate-y-0.5">
        <FileTextIcon className="size-4 sm:size-5 text-info" />
        <span>{t("moduleCirculars")}</span>
      </div>
      <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/85 px-5 sm:px-6 py-3 shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-warning/50 hover:bg-card hover:-translate-y-0.5">
        <WrenchIcon className="size-4 sm:size-5 text-warning" />
        <span>{t("moduleMaintenance")}</span>
      </div>
      <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/85 px-5 sm:px-6 py-3 shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-success/50 hover:bg-card hover:-translate-y-0.5">
        <CalendarDaysIcon className="size-4 sm:size-5 text-success" />
        <span>{t("moduleCalendar")}</span>
      </div>
    </div>
  );
}
