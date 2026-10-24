"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  FileTextIcon,
  WrenchIcon,
  CalendarDaysIcon,
  AwardIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardStatsGrid({
  circularsCount,
  maintenanceCount,
  eventsCount,
  achievementsCount,
}: {
  circularsCount: number;
  maintenanceCount: number;
  eventsCount: number;
  achievementsCount: number;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const items = [
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
    {
      title: t("achievementsCount"),
      count: achievementsCount,
      desc: t("achievementsDesc"),
      href: `/${locale}/achievements`,
      icon: AwardIcon,
      accent: "text-emerald-500 bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href + item.title} href={item.href} className="group">
            <Card className="h-full border-border bg-card transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg ${item.accent}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground opacity-0 transition-all group-hover:text-primary group-hover:opacity-100 rtl:-rotate-90" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {item.count}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-foreground">{item.title}</div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
