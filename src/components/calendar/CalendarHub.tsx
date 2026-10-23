"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PlusIcon, CalendarIcon, AwardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarEventsView } from "./CalendarEventsView";
import { SchoolAchievementsHub } from "@/components/achievements/SchoolAchievementsHub";
import type { CalendarEventRow } from "@/lib/calendar/types";
import type { SchoolAchievementRow } from "@/lib/achievements/types";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";

export function CalendarHub({
  events,
  achievements,
  departments,
  canManage,
}: {
  events: CalendarEventRow[];
  achievements: SchoolAchievementRow[];
  departments: DepartmentRow[];
  canManage: boolean;
}) {
  const t = useTranslations("calendar");
  const tAch = useTranslations("achievements");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"events" | "achievements">("events");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        {canManage && activeTab === "events" && (
          <Link href={`/${locale}/calendar/new`}>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              <span>{t("newEvent")}</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={activeTab === "events" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("events")}
          className="gap-2"
        >
          <CalendarIcon className="size-4" />
          <span>{tAch("tabEvents")}</span>
          <span className="py-0.2 rounded-full bg-background/20 px-1.5 text-[10px] font-bold">
            {events.length}
          </span>
        </Button>
        <Button
          variant={activeTab === "achievements" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("achievements")}
          className="gap-2"
        >
          <AwardIcon className="size-4" />
          <span>{tAch("tabAchievements")}</span>
          <span className="py-0.2 rounded-full bg-background/20 px-1.5 text-[10px] font-bold">
            {achievements.length}
          </span>
        </Button>
      </div>

      {activeTab === "events" ? (
        <CalendarEventsView events={events} canManage={canManage} />
      ) : (
        <SchoolAchievementsHub
          achievements={achievements}
          departments={departments}
          canManage={canManage}
        />
      )}
    </div>
  );
}
