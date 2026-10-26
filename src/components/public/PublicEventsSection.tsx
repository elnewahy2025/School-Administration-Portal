"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarDaysIcon } from "lucide-react";
import type { CalendarEventRow } from "@/lib/calendar/types";
import { PublicEventCard } from "./PublicEventCard";

export function PublicEventsSection({ events }: { events: CalendarEventRow[] }) {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <section id="events" className="border-t border-border/60 bg-muted/10 py-20 px-4 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-[1720px] space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-primary">
            <CalendarDaysIcon className="size-4" />
            <span>{t("navEvents")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {t("publicCalendar")}
          </h2>
          <p className="mx-auto max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t("publicCalendarDesc")}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center shadow-2xs">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary mb-3">
              <CalendarDaysIcon className="size-7" />
            </div>
            <p className="text-sm sm:text-base font-medium text-foreground">{t("noPublicEvents")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((ev) => (
              <PublicEventCard key={ev.id} event={ev} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
