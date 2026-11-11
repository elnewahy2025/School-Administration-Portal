"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PANEL } from "@/components/ui/diamond-card-styles";
import { CalendarCoreFields } from "./CalendarCoreFields";
import { CalendarDateTimeFields } from "./CalendarDateTimeFields";
import { CalendarImageField } from "./CalendarImageField";
import { formatDateTimeInput } from "@/lib/calendar/formatDateTimeInput";
import { updateCalendarEventAction } from "@/actions/calendar/updateCalendarEventAction";
import { getCalendarImageUrl } from "@/lib/calendar/getCalendarImageUrl";
import { validateCalendarEventFormSubmission } from "@/lib/calendar/validateCalendarEventFormSubmission";
import { useDeleteCalendarEvent } from "./useDeleteCalendarEvent";
import type { CalendarEventRow } from "@/lib/calendar/types";

type EditCalendarEventFormProps = {
  event: CalendarEventRow;
  workingDays?: number[] | null;
};

export function EditCalendarEventForm({ event, workingDays }: EditCalendarEventFormProps) {
  const t = useTranslations("calendar");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { confirmAndDelete, isDeleting } = useDeleteCalendarEvent({
    eventId: event.id,
    redirectTo: `/${locale}/calendar`,
  });

  const currentImageUrl = getCalendarImageUrl(event.image_path);

  const handleSubmit = (formData: FormData) => {
    const validation = validateCalendarEventFormSubmission(formData, workingDays);
    if (!validation.valid) {
      toast.error(
        validation.error === "weekendNotAllowed" ? t("weekendNotAllowed") : validation.error,
      );
      return;
    }

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

      <div className={`${PANEL} space-y-4 p-6 sm:p-8`}>
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
          workingDays={workingDays}
        />
        <CalendarImageField initialImageUrl={currentImageUrl} disabled={isPending} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isPending || isDeleting}
          onClick={confirmAndDelete}
          className="gap-1.5 text-destructive hover:bg-destructive/10"
        >
          <Trash2Icon className="size-4" />
          <span>{t("actions.delete")}</span>
        </Button>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/calendar/${event.id}`}>
            <Button variant="outline">{tCommon("cancel")}</Button>
          </Link>
          <Button type="submit" disabled={isPending || isDeleting}>
            {isPending ? tCommon("loading") : tCommon("save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
