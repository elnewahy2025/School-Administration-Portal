"use client";

import { useLocale, useTranslations } from "next-intl";
import { CompassIcon, TargetIcon, AwardIcon, UserCheckIcon } from "lucide-react";
import type { PublicSchoolProfileRow } from "@/lib/school/getPublicSchoolProfile";
import { buildAboutCardList, type AboutCardItem } from "@/lib/school/buildAboutCardList";
import { PublicAboutCard } from "./PublicAboutCard";

const CARD_CONFIG = {
  vision: {
    icon: <CompassIcon className="size-5" />,
    colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  mission: {
    icon: <TargetIcon className="size-5" />,
    colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  leadership: {
    icon: <UserCheckIcon className="size-5" />,
    colorClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  objectives: {
    icon: <AwardIcon className="size-5" />,
    colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
} as const;

export function PublicAboutSection({ school }: { school: PublicSchoolProfileRow | null }) {
  const t = useTranslations("home");
  const tSettings = useTranslations("settings");
  const locale = useLocale();

  const cards = buildAboutCardList(school, locale, t, tSettings);
  if (cards.length === 0) {
    return null;
  }

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-16 space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t("aboutSectionTitle")}
        </h2>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t("aboutSectionDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((item: AboutCardItem) => {
          const config = CARD_CONFIG[item.iconType];
          return (
            <PublicAboutCard
              key={item.key}
              icon={config.icon}
              iconColorClass={config.colorClass}
              title={item.title}
              content={item.content}
            />
          );
        })}
      </div>
    </section>
  );
}
