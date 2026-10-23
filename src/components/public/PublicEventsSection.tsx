"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { CalendarEventCategoryBadge } from "@/components/calendar/CalendarEventCategoryBadge";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function PublicEventsSection({ events }: { events: CalendarEventRow[] }) {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 border-t border-border">
      <div className="mb-8 text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("publicCalendar")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("publicCalendarDesc")}</p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          {t("noPublicEvents")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const title = locale === "ar" ? ev.title_ar : (ev.title_en || ev.title_ar);
            const dateStr = new Date(ev.starts_at).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US",
              { month: "short", day: "numeric", weekday: "short" },
            );
            return (
              <div key={ev.id} className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <CalendarEventCategoryBadge category={ev.category} />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="size-3" />
                    {dateStr}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm line-clamp-1">{title}</h3>
                {ev.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{ev.description}</p>
                )}
                {ev.location && (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground border-t border-border pt-2">
                    <MapPinIcon className="size-3" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
