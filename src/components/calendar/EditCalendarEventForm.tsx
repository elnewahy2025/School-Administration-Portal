"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeftIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarCoreFields } from "./CalendarCoreFields";
import { CalendarDateTimeFields } from "./CalendarDateTimeFields";
import { formatDateTimeInput } from "@/lib/calendar/formatDateTimeInput";
import { updateCalendarEventAction } from "@/actions/calendar/updateCalendarEventAction";
import type { CalendarEventRow } from "@/lib/calendar/types";

export function EditCalendarEventForm({ event }: { event: CalendarEventRow }) {
  const t = useTranslations("calendar");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateCalendarEventAction(formData);
      if (res.success) {
        toast.success(tCommon("saved"));
        router.push(`/${locale}/calendar/${event.id}`);
      } else {
        toast.error(res.error || tCommon("error"));
      }
    });
  };

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <input type="hidden" name="event_id" value={event.id} />

      <Link href={`/${locale}/calendar/${event.id}`}>
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          <span>{t("backToList")}</span>
        </Button>
      </Link>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-xs">
        <CalendarCoreFields
          defaultCategory={event.category}
          defaultTitleAr={event.title_ar}
          defaultTitleEn={event.title_en}
          defaultDescription={event.description}
          defaultLocation={event.location}
        />
        <CalendarDateTimeFields
          defaultStartsAt={formatDateTimeInput(event.starts_at)}
          defaultEndsAt={formatDateTimeInput(event.ends_at)}
          defaultAllDay={event.all_day}
          defaultVisibility={event.visibility}
        />

        <div className="space-y-2 border-t border-border pt-4">
          <Label htmlFor="image" className="flex items-center gap-2">
            <UploadIcon className="size-4 text-muted-foreground" />
            <span>{t("bannerImage")}</span>
          </Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
          />
          <p className="text-xs text-muted-foreground">{t("bannerHelp")}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link href={`/${locale}/calendar/${event.id}`}>
          <Button variant="outline">{tCommon("cancel")}</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? tCommon("loading") : tCommon("save")}
        </Button>
      </div>
    </form>
  );
}
