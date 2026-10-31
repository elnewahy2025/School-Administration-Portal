"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarDaysIcon } from "lucide-react";
import type { CalendarEventRow } from "@/lib/calendar/types";
import { PublicEventCard } from "./PublicEventCard";
import { PublicSectionTitle } from "./PublicSectionTitle";

export function PublicEventsSection({ events }: { events: CalendarEventRow[] }) {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <section id="events" className="border-t border-border/60 py-20 px-4 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-[1720px] space-y-12 animate-hero-fade-up delay-750">
        <div className="space-y-3 text-center">
          <PublicSectionTitle>{t("publicCalendar")}</PublicSectionTitle>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("publicCalendarDesc")}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-[color:var(--panel,#eef2f7)] p-5 pt-12 shadow-[0_12px_30px_rgba(20,37,74,.10),inset_0_0_0_4px_var(--background)] sm:p-8 sm:pt-14">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center shadow-2xs">
              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <CalendarDaysIcon className="size-7" />
              </div>
              <p className="text-sm font-medium text-foreground sm:text-base">{t("noPublicEvents")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((ev) => (
                <PublicEventCard key={ev.id} event={ev} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
