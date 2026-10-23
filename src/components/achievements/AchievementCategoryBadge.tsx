import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  TrophyIcon,
  BookOpenIcon,
  FlaskConicalIcon,
  MedalIcon,
  HeartHandshakeIcon,
  SparklesIcon,
} from "lucide-react";
import type { AchievementCategory } from "@/lib/achievements/types";

export function AchievementCategoryBadge({ category }: { category: AchievementCategory }) {
  const t = useTranslations("achievements.categories");

  if (category === "academic") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
      >
        <BookOpenIcon className="size-3" />
        <span>{t("academic")}</span>
      </Badge>
    );
  }

  if (category === "competition") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
      >
        <TrophyIcon className="size-3" />
        <span>{t("competition")}</span>
      </Badge>
    );
  }

  if (category === "scientific") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        <FlaskConicalIcon className="size-3" />
        <span>{t("scientific")}</span>
      </Badge>
    );
  }

  if (category === "sports") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400"
      >
        <MedalIcon className="size-3" />
        <span>{t("sports")}</span>
      </Badge>
    );
  }

  if (category === "community") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
      >
        <HeartHandshakeIcon className="size-3" />
        <span>{t("community")}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
    >
      <SparklesIcon className="size-3" />
      <span>{t("other")}</span>
    </Badge>
  );
}
