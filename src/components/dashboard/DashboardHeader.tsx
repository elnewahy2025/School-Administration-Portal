"use client";

import { useLocale, useTranslations } from "next-intl";
import { Building2Icon, UserCheckIcon } from "lucide-react";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";
import { resolveDepartmentName } from "@/lib/auth/resolveDepartmentName";
import { DashboardVisionMission } from "./DashboardVisionMission";

export function DashboardHeader({
  profile,
  school,
}: {
  profile?: ProfileRow;
  school: SchoolFullDetails | null;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const deptName = resolveDepartmentName(profile ?? null, locale);

  return (
    <div className="space-y-4">
      {profile ? (
        <div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCheckIcon className="size-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">
                  {t("welcome", { name: profile.full_name })}
                </h1>
                {deptName ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <Building2Icon className="size-3" />
                    {deptName}
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile.job_title ?? profile.email ?? ""}
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <DashboardVisionMission school={school} />
    </div>
  );
}
