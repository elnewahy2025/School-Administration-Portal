"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarEventCategoryBadge } from "./CalendarEventCategoryBadge";
import { CalendarEventStatusBadge } from "./CalendarEventStatusBadge";
import { CalendarVisibilityBadge } from "./CalendarVisibilityBadge";
import { CalendarEventImageBanner } from "./CalendarEventImageBanner";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function CalendarEventDetailContent({
  event,
  onClose,
}: {
  event: CalendarEventRow;
  onClose: () => void;
}) {
  const locale = useLocale();
  const tCal = useTranslations("calendar");
  const tCommon = useTranslations("common");

  const formattedDate = new Date(event.starts_at).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  );

  const formattedTime = event.all_day
    ? tCal("allDayBadge")
    : `${new Date(event.starts_at).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.ends_at).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <div className="mt-5 space-y-5">
      <CalendarEventImageBanner imagePath={event.image_path} altText={event.title_ar} />
      <div className="flex flex-wrap items-center gap-2">
        <CalendarEventCategoryBadge category={event.category} />
        <CalendarVisibilityBadge visibility={event.visibility} />
        <CalendarEventStatusBadge status={event.status} />
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg border border-border/60 bg-muted/30 p-3.5 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 shrink-0 text-primary" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 shrink-0 text-primary" />
          <span>{formattedTime}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-4 shrink-0 text-primary" />
            <span>{event.location}</span>
          </div>
        )}
        {event.creator && (
          <div className="flex items-center gap-2">
            <UserIcon className="size-4 shrink-0 text-primary" />
            <span>{event.creator.full_name}</span>
          </div>
        )}
      </div>

      {event.description && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {tCal("eventDescription")}
          </h4>
          <p className="rounded-lg border border-border bg-background p-3 text-sm whitespace-pre-wrap text-foreground">
            {event.description}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2 border-t border-border pt-2">
        <Button variant="outline" onClick={onClose}>
          {tCommon("cancel")}
        </Button>
        <Link href={`/${locale}/calendar/${event.id}`}>
          <Button className="gap-2">
            <ExternalLinkIcon className="size-4" />
            <span>View Full Event</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
