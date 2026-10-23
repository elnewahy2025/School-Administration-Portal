"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FileTextIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircularPriorityBadge, CircularStatusBadge } from "@/components/circulars";
import type { CircularRow } from "@/lib/circulars/types";

export function DashboardRecentCirculars({ circulars }: { circulars: CircularRow[] }) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <FileTextIcon className="size-4 text-primary" />
          <CardTitle className="text-base font-bold">{t("recentCirculars")}</CardTitle>
        </div>
        <Link
          href={`/${locale}/circulars`}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>{t("viewAll")}</span>
          <ArrowRightIcon className="size-3 rtl:rotate-180" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {circulars.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">{t("noRecentCirculars")}</p>
        ) : (
          circulars.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={`/${locale}/circulars/${c.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {c.ref_number}
                  </span>
                  <CircularPriorityBadge priority={c.priority} />
                </div>
                <h4 className="truncate text-xs font-bold text-foreground">{c.title}</h4>
              </div>
              <CircularStatusBadge status={c.status} />
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
