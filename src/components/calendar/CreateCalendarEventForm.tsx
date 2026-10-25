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
import { CalendarRecurrenceFields } from "./CalendarRecurrenceFields";
import { createCalendarEventAction } from "@/actions/calendar/createCalendarEventAction";

export function CreateCalendarEventForm() {
  const t = useTranslations("calendar");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await createCalendarEventAction(formData);
      if (res.success) {
        toast.success(tCommon("saved"));
        router.push(`/${locale}/calendar`);
      } else {
        toast.error(res.error || tCommon("error"));
      }
    });
  };

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <Link href={`/${locale}/calendar`}>
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          <span>{t("backToList")}</span>
        </Button>
      </Link>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-xs">
        <CalendarCoreFields />
        <CalendarDateTimeFields />
        <CalendarRecurrenceFields />

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
        <Link href={`/${locale}/calendar`}>
          <Button variant="outline">{tCommon("cancel")}</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? tCommon("loading") : t("newEvent")}
        </Button>
      </div>
    </form>
  );
}
