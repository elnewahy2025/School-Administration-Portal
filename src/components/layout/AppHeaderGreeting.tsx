"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon } from "lucide-react";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

export function AppHeaderGreeting({
  profile,
  school,
}: {
  profile: ProfileRow | null;
  school: SchoolRow | null;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const todayStr = new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2 text-xs">
      {profile?.full_name && (
        <span className="hidden font-medium text-foreground sm:inline">
          {t("welcome", { name: profile.full_name })}
        </span>
      )}
      {school?.academic_year && (
        <span className="hidden rounded-md border border-border bg-background/80 px-2 py-1 font-medium text-muted-foreground md:inline-flex">
          {school.academic_year}
        </span>
      )}
      <div className="hidden items-center gap-1.5 rounded-md border border-border bg-background/80 px-2 py-1 text-muted-foreground lg:flex">
        <CalendarIcon className="size-3.5" />
        <span>{todayStr}</span>
      </div>
    </div>
  );
}
