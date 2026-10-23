import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { CircularRow } from "@/lib/circulars/types";

export function CircularTargetBadges({ targets }: { targets?: CircularRow["targets"] }) {
  const t = useTranslations("circulars");
  const locale = useLocale();

  if (!targets || targets.length === 0) {
    return (
      <Badge variant="outline" className="border-dashed text-xs text-muted-foreground">
        {t("allDepartments")}
      </Badge>
    );
  }

  const visible = targets.slice(0, 2);
  const remaining = targets.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((tgt) => {
        const name =
          locale === "ar"
            ? tgt.departments?.name_ar || tgt.departments?.name_en
            : tgt.departments?.name_en || tgt.departments?.name_ar;
        return (
          <Badge key={tgt.id} variant="secondary" className="px-1.5 py-0.5 text-[11px]">
            {name ?? t("allDepartments")}
          </Badge>
        );
      })}
      {remaining > 0 ? (
        <span className="text-[11px] font-medium text-muted-foreground">+{remaining}</span>
      ) : null}
    </div>
  );
}
