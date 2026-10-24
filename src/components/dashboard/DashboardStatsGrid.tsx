"use client";

import { useLocale, useTranslations } from "next-intl";
import { FileTextIcon, WrenchIcon, CalendarDaysIcon, AwardIcon } from "lucide-react";
import { DashboardStatCard, type DashboardStatItem } from "./DashboardStatCard";

export function DashboardStatsGrid({
  circularsCount,
  maintenanceCount,
  eventsCount,
  achievementsCount,
  isOwner = false,
}: {
  circularsCount: number;
  maintenanceCount: number;
  eventsCount: number;
  achievementsCount?: number;
  isOwner?: boolean;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const items: DashboardStatItem[] = [
    {
      title: t("activeCirculars"),
      count: circularsCount,
      desc: t("activeCircularsDesc"),
      href: `/${locale}/circulars`,
      icon: FileTextIcon,
      accent: "text-blue-500 bg-blue-500/10",
    },
    {
      title: t("openMaintenance"),
      count: maintenanceCount,
      desc: t("openMaintenanceDesc"),
      href: `/${locale}/maintenance`,
      icon: WrenchIcon,
      accent: "text-amber-500 bg-amber-500/10",
    },
    {
      title: t("upcomingEvents"),
      count: eventsCount,
      desc: t("upcomingEventsDesc"),
      href: `/${locale}/calendar`,
      icon: CalendarDaysIcon,
      accent: "text-purple-500 bg-purple-500/10",
    },
    ...(isOwner && achievementsCount !== undefined
      ? [
          {
            title: t("achievementsCount"),
            count: achievementsCount,
            desc: t("achievementsDesc"),
            href: `/${locale}/achievements`,
            icon: AwardIcon,
            accent: "text-emerald-500 bg-emerald-500/10",
          },
        ]
      : []),
  ];

  return (
    <div
      className={
        isOwner
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {items.map((item) => (
        <DashboardStatCard key={item.href + item.title} item={item} />
      ))}
    </div>
  );
}
