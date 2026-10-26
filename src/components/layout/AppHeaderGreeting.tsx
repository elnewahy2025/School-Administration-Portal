"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon, Building2Icon } from "lucide-react";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";
import { resolveDepartmentName } from "@/lib/auth/resolveDepartmentName";

export function AppHeaderGreeting({
  profile,
  school,
}: {
  profile: ProfileRow | null;
  school: SchoolRow | null;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const departmentName = resolveDepartmentName(profile, locale);

  const todayStr = new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 text-sm font-human">
      {profile?.full_name && (
        <span className="hidden text-base font-bold text-foreground sm:inline">
          {t("welcome", { name: profile.full_name })}
        </span>
      )}
      {departmentName && (
        <span className="hidden items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-2xs sm:inline-flex">
          <Building2Icon className="size-3.5" />
          {departmentName}
        </span>
      )}
      {school?.academic_year && (
        <span className="hidden rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground/80 shadow-2xs md:inline-flex">
          {school.academic_year}
        </span>
      )}
      <div className="hidden items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground/80 shadow-2xs lg:flex">
        <CalendarIcon className="size-4 text-primary" />
        <span>{todayStr}</span>
      </div>
    </div>
  );
}
