"use client";

import { useLocale, useTranslations } from "next-intl";
import { BuildingIcon, CalendarIcon } from "lucide-react";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";
import { DashboardVisionMission } from "./DashboardVisionMission";

export function DashboardHeader({
  profile,
  school,
}: {
  profile: ProfileRow;
  school: SchoolFullDetails | null;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const schoolName = school ? (locale === "ar" ? school.name_ar : school.name_en) : null;

  const todayStr = new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-gradient-to-r from-card to-card/60 p-6 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("welcome", { name: profile.full_name })}
          </h1>
          <p className="text-xs text-muted-foreground">{t("schoolOverview")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {schoolName && (
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-2.5 py-1.5 font-medium text-foreground">
              <BuildingIcon className="size-3.5 text-primary" />
              <span>{schoolName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-muted-foreground">
            <CalendarIcon className="size-3.5" />
            <span>{todayStr}</span>
          </div>
        </div>
      </div>

      <DashboardVisionMission school={school} />
    </div>
  );
}
