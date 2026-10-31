"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarDaysIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { CalendarEventRow } from "@/lib/calendar/types";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";
import { resolveLocalizedText } from "@/lib/school/resolveLocalizedText";
import { parseSchoolNameHierarchy } from "@/lib/school/parseSchoolNameHierarchy";

/** Navy top bar + gold ticker from the services guide. */
export function PublicTopBar({
  school,
  events,
}: {
  school: PublicSchoolProfileRow | null;
  events: CalendarEventRow[];
}) {
  const locale = useLocale();
  const t = useTranslations("home");

  const rawName = resolveLocalizedText(locale, school?.name_ar, school?.name_en);
  const { primaryName } = parseSchoolNameHierarchy(rawName);
  const brand = primaryName || t("title");

  const tickerItems = events
    .slice(0, 6)
    .map((ev) => (locale === "ar" ? ev.title_ar : ev.title_en || ev.title_ar));

  return (
    <header className="relative z-30 border-b-4 border-gold bg-[linear-gradient(90deg,var(--topbar-from,var(--sidebar)),var(--topbar-to,var(--sidebar)))] text-sidebar-foreground">
      <div className="mx-auto flex w-full max-w-[1720px] items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12 xl:px-16">
        <span className="truncate text-base font-extrabold tracking-wide sm:text-lg">{brand}</span>
        <div className="flex shrink-0 items-center gap-2.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {tickerItems.length > 0 && (
        <div className="border-t border-scrim-foreground/10 bg-scrim/15">
          <div className="mx-auto flex w-full max-w-[1720px] items-center gap-3.5 overflow-hidden px-4 py-1.5 sm:px-8 lg:px-12 xl:px-16">
            <span className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-sidebar-primary px-4 py-2 text-xs font-extrabold text-sidebar-primary-foreground sm:text-sm">
              <CalendarDaysIcon className="size-4" />
              {t("tickerLabel")}
            </span>
            <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-sm font-bold text-sidebar-primary">
              <span className="animate-ticker">{tickerItems.join("   •   ")}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
