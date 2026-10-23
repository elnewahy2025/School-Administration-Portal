"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { WrenchIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MaintenancePriorityBadge, MaintenanceStatusBadge } from "@/components/maintenance";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";

export function DashboardRecentMaintenance({ requests }: { requests: MaintenanceRequestRow[] }) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <WrenchIcon className="size-4 text-primary" />
          <CardTitle className="text-base font-bold">{t("recentMaintenance")}</CardTitle>
        </div>
        <Link
          href={`/${locale}/maintenance`}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>{t("viewAll")}</span>
          <ArrowRightIcon className="size-3 rtl:rotate-180" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {requests.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            {t("noRecentMaintenance")}
          </p>
        ) : (
          requests.slice(0, 4).map((m) => (
            <Link
              key={m.id}
              href={`/${locale}/maintenance/${m.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {m.ticket_number}
                  </span>
                  <MaintenancePriorityBadge priority={m.priority} />
                </div>
                <h4 className="truncate text-xs font-bold text-foreground">{m.title}</h4>
              </div>
              <MaintenanceStatusBadge status={m.status} />
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
