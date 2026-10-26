"use client";

import { useLocale, useTranslations } from "next-intl";
import { CompassIcon, TargetIcon } from "lucide-react";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";
import { resolveHeroSchoolData } from "@/lib/school/resolveHeroSchoolData";
import { PublicHeroSideCard } from "./PublicHeroSideCard";
import { PublicHeroLeadershipCard } from "./PublicHeroLeadershipCard";
import { PublicHeroLoginButton } from "./PublicHeroLoginButton";

export function PublicHeroCardsGrid({ school }: { school: PublicSchoolProfileRow | null }) {
  const locale = useLocale();
  const t = useTranslations("home");
  const data = resolveHeroSchoolData(school, locale);

  const hasLeadership = Boolean(data.manager || data.assistant1 || data.assistant2);

  return (
    <div className="w-full grid grid-cols-1 items-stretch gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-3">
      {data.vision ? (
        <PublicHeroSideCard
          icon={<CompassIcon className="size-5" />}
          iconClass="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
          title={t("vision")}
          content={data.vision}
        />
      ) : (
        <div />
      )}

      <div className="flex flex-col items-center justify-between gap-4">
        {hasLeadership ? (
          <PublicHeroLeadershipCard
            manager={data.manager}
            assistant1={data.assistant1}
            assistant2={data.assistant2}
          />
        ) : (
          <div />
        )}

        <PublicHeroLoginButton />
      </div>

      {data.mission ? (
        <PublicHeroSideCard
          icon={<TargetIcon className="size-5" />}
          iconClass="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          title={t("mission")}
          content={data.mission}
        />
      ) : (
        <div />
      )}
    </div>
  );
}
