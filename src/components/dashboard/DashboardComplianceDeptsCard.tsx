"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function DashboardComplianceDeptsCard({
  responded,
  pending,
}: {
  responded: Array<{ id: string; name: string }>;
  pending: Array<{ id: string; name: string }>;
}) {
  const t = useTranslations("dashboard");

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 shadow-2xs transition-colors dark:border-emerald-500/20 dark:bg-emerald-950/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {t("respondedDepartments")} ({responded.length})
          </span>
          <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {responded.length > 0 ? (
            responded.map((d) => (
              <Badge
                key={d.id}
                variant="secondary"
                className="border-emerald-500/30 bg-emerald-500/15 text-[11px] font-semibold text-emerald-800 transition-transform hover:scale-105 dark:text-emerald-200"
              >
                {d.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-rose-500/25 bg-rose-500/5 p-3.5 shadow-2xs transition-colors dark:border-rose-500/20 dark:bg-rose-950/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
            {t("pendingDepartments")} ({pending.length})
          </span>
          {pending.length > 0 ? (
            <span className="size-2 rounded-full bg-rose-500" />
          ) : (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {pending.length > 0 ? (
            pending.map((d) => (
              <Badge
                key={d.id}
                variant="destructive"
                className="border-rose-500/30 bg-rose-500/15 text-[11px] font-semibold text-rose-800 transition-transform hover:scale-105 dark:text-rose-200"
              >
                {d.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {t("claimed")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
