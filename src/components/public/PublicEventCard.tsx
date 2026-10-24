import { CalendarIcon, MapPinIcon } from "lucide-react";
import { CalendarEventCategoryBadge } from "@/components/calendar/CalendarEventCategoryBadge";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function PublicEventCard({
  event,
  locale,
}: {
  event: CalendarEventRow;
  locale: string;
}) {
  const title = locale === "ar" ? event.title_ar : (event.title_en || event.title_ar);
  const eventDate = new Date(event.starts_at);

  const monthStr = eventDate.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    month: "short",
  });
  const dayStr = eventDate.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
  });
  const weekdayStr = eventDate.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "short",
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/80 p-5 shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CalendarEventCategoryBadge category={event.category} />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CalendarIcon className="size-3 text-primary" />
            <span>{weekdayStr}</span>
          </span>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 px-2.5 py-1.5 min-w-[50px] text-center shadow-2xs">
            <span className="text-[10px] font-semibold uppercase text-primary tracking-wider">
              {monthStr}
            </span>
            <span className="text-lg font-black text-foreground leading-none">{dayStr}</span>
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-sm sm:text-base tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {event.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {event.location && (
        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border/60 pt-3">
          <MapPinIcon className="size-3.5 text-primary shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      )}
    </div>
  );
}
