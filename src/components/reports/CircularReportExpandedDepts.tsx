import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { DepartmentCompactItem } from "@/lib/reports/types";

export function CircularReportExpandedDepts({
  responded,
  pending,
}: {
  responded: DepartmentCompactItem[];
  pending: DepartmentCompactItem[];
}) {
  const t = useTranslations("circulars");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          {t("respondedDepartments")} ({responded.length})
        </span>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {responded.length > 0 ? (
            responded.map((d) => (
              <Badge
                key={d.id}
                variant="secondary"
                className="border-emerald-500/30 bg-emerald-500/15 text-xs text-emerald-700 dark:text-emerald-300"
              >
                {d.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </div>

      <div className="space-y-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
        <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
          {t("pendingDepartments")} ({pending.length})
        </span>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {pending.length > 0 ? (
            pending.map((d) => (
              <Badge
                key={d.id}
                variant="destructive"
                className="border-rose-500/30 bg-rose-500/15 text-xs text-rose-700 dark:text-rose-300"
              >
                {d.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
