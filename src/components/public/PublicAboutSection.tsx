"use client";

import { useTranslations } from "next-intl";
import { CompassIcon, TargetIcon, AwardIcon } from "lucide-react";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";

export function PublicAboutSection({ school }: { school: PublicSchoolProfileRow | null }) {
  const t = useTranslations("home");

  const vision = school?.vision;
  const mission = school?.mission;
  const objectives = school?.objectives;

  if (!vision && !mission && !objectives) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {vision && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CompassIcon className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("vision")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{vision}</p>
          </div>
        )}

        {mission && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TargetIcon className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("mission")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{mission}</p>
          </div>
        )}

        {objectives && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <AwardIcon className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("achievements")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{objectives}</p>
          </div>
        )}
      </div>
    </section>
  );
}
