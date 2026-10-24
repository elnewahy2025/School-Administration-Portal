"use client";

import { useLocale, useTranslations } from "next-intl";
import { BuildingIcon, CalendarIcon } from "lucide-react";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";
import { getSchoolLogoUrl } from "@/lib/school/getSchoolLogoUrl";
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
  const logoUrl = getSchoolLogoUrl(school?.logo_path);

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
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="School logo" className="size-4 object-contain" />
              ) : (
                <BuildingIcon className="size-3.5 text-primary" />
              )}
              <span className="whitespace-pre-line">{schoolName}</span>
            </div>
          )}
          {school?.academic_year && (
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-2.5 py-1.5 font-medium text-muted-foreground">
              <span>{school.academic_year}</span>
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
