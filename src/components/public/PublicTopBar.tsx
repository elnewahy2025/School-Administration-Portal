"use client";

import { useLocale, useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { PublicInstagramLink } from "./PublicInstagramLink";
import { PublicTopBarTicker } from "./PublicTopBarTicker";
import type { CalendarEventRow } from "@/lib/calendar/types";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";
import { resolveLocalizedText } from "@/lib/school/resolveLocalizedText";
import { parseSchoolNameHierarchy } from "@/lib/school/parseSchoolNameHierarchy";

/** Navy top bar with school branding, description, Instagram link, and ticker. */
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
  const description = school?.public_description || t("subtitle");

  return (
    <header className="relative z-30 border-b-4 border-gold bg-[linear-gradient(90deg,var(--topbar-from,var(--sidebar)),var(--topbar-to,var(--sidebar)))] text-sidebar-foreground">
      <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 xl:px-16">
        <div className="min-w-0 space-y-0.5">
          <h1 className="truncate text-base font-black tracking-wide sm:text-xl text-sidebar-foreground">
            {brand}
          </h1>
          {description ? (
            <p className="line-clamp-2 text-xs font-medium text-sidebar-foreground/80 sm:line-clamp-1 max-w-3xl">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2.5 self-end sm:self-center">
          <PublicInstagramLink url={school?.instagram_url} />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <PublicTopBarTicker events={events} />
    </header>
  );
}
