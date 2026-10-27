"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  WrenchIcon,
  CalendarIcon,
  AwardIcon,
  BarChart3Icon,
  SettingsIcon,
  DatabaseIcon,
} from "lucide-react";
import { NavLink } from "./NavLink";
import { SchoolLogoAvatar } from "./SchoolLogoAvatar";
import { resolveSchoolName } from "@/lib/school/resolveSchoolName";
import { parseSchoolNameHierarchy } from "@/lib/school/parseSchoolNameHierarchy";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

export function AppSidebar({
  school,
  isOwner = false,
  canManageSettings,
  canViewReports,
  canBackupRestore = false,
}: {
  school: SchoolRow | null;
  isOwner?: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
  canBackupRestore?: boolean;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const schoolName = resolveSchoolName(school, locale, t("portal"));
  const { primaryName } = parseSchoolNameHierarchy(schoolName);
  const displayName = primaryName || schoolName;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <SchoolLogoAvatar school={school} />
        <div className="flex flex-col overflow-hidden">
          <span
            className="truncate text-sm font-semibold text-sidebar-foreground"
            title={displayName}
          >
            {displayName}
          </span>
          <span className="text-xs text-sidebar-foreground/70">{t("portal")}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        <NavLink href="/dashboard" label={t("dashboard")} icon={LayoutDashboardIcon} />
        <NavLink href="/circulars" label={t("circulars")} icon={FileTextIcon} />
        <NavLink href="/maintenance" label={t("maintenance")} icon={WrenchIcon} />
        <NavLink href="/calendar" label={t("calendar")} icon={CalendarIcon} />
        {isOwner ? (
          <NavLink href="/achievements" label={t("achievements")} icon={AwardIcon} />
        ) : null}
        {canViewReports ? (
          <NavLink href="/reports" label={t("reports")} icon={BarChart3Icon} />
        ) : null}
        {canManageSettings ? (
          <NavLink
            href="/settings"
            label={t("settings")}
            icon={SettingsIcon}
            excludedPrefixes={canBackupRestore ? ["/settings/backup"] : undefined}
          />
        ) : null}
        {canBackupRestore ? (
          <NavLink href="/settings/backup" label={t("backup")} icon={DatabaseIcon} />
        ) : null}
      </nav>

      <div className="border-t border-sidebar-border p-4 text-center">
        <p className="text-xs text-sidebar-foreground/60">v0.1.0 · Next.js 16</p>
      </div>
    </aside>
  );
}
