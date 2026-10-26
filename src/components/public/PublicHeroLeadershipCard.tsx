"use client";

import { useTranslations } from "next-intl";
import { UserCheckIcon } from "lucide-react";

export function PublicHeroLeadershipCard({
  manager,
  assistant1,
  assistant2,
}: {
  manager?: string | null;
  assistant1?: string | null;
  assistant2?: string | null;
}) {
  const t = useTranslations("home");
  const tSettings = useTranslations("settings");

  return (
    <div className="group relative flex w-full flex-col items-center rounded-3xl border border-border/80 bg-card/75 p-6 sm:p-8 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg space-y-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-2xs transition-transform duration-300 group-hover:scale-110">
        <UserCheckIcon className="size-5" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
        {tSettings("leadership")}
      </h3>
      <div className="space-y-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
        {manager && (
          <p>
            {t("managerTitle")}: <span className="font-semibold text-foreground">{manager}</span>
          </p>
        )}
        {assistant1 && (
          <p>
            {t("assistantManager1Title")}:{" "}
            <span className="font-semibold text-foreground">{assistant1}</span>
          </p>
        )}
        {assistant2 && (
          <p>
            {t("assistantManager2Title")}:{" "}
            <span className="font-semibold text-foreground">{assistant2}</span>
          </p>
        )}
      </div>
    </div>
  );
}
