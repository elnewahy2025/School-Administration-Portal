import { useTranslations } from "next-intl";
import { InfoIcon } from "lucide-react";

export function CalendarWeekendNotice() {
  const t = useTranslations("calendar");

  return (
    <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
      <InfoIcon className="size-4 shrink-0" />
      <span>{t("weekendNotice")}</span>
    </div>
  );
}
