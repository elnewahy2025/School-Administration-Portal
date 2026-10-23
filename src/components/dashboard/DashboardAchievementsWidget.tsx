"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AwardIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AchievementCategoryBadge } from "@/components/achievements";
import type { SchoolAchievementRow } from "@/lib/achievements/types";

export function DashboardAchievementsWidget({
  achievements,
}: {
  achievements: SchoolAchievementRow[];
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <AwardIcon className="size-4 text-emerald-500" />
          <CardTitle className="text-base font-bold">{t("recentAchievements")}</CardTitle>
        </div>
        <Link
          href={`/${locale}/calendar`}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>{t("viewAll")}</span>
          <ArrowRightIcon className="size-3 rtl:rotate-180" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {achievements.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            {t("noRecentAchievements")}
          </p>
        ) : (
          achievements.slice(0, 3).map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <AchievementCategoryBadge category={a.category} />
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(a.date_achieved).toLocaleDateString(
                      locale === "ar" ? "ar-EG" : "en-US",
                      { dateStyle: "medium" },
                    )}
                  </span>
                </div>
                <h4 className="truncate text-xs font-bold text-foreground">{a.title_ar}</h4>
                {a.description && (
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">{a.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
