"use client";

import { useTranslations } from "next-intl";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  WrenchIcon,
  CalendarIcon,
  AwardIcon,
  BarChart3Icon,
  SettingsIcon,
} from "lucide-react";
import { NavLink } from "./NavLink";

export function MobileNavLinks({
  isOwner = false,
  canManageSettings,
  canViewReports,
  onSelect,
}: {
  isOwner?: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations("nav");

  return (
    <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
      <NavLink
        href="/dashboard"
        label={t("dashboard")}
        icon={LayoutDashboardIcon}
        onClick={onSelect}
      />
      <NavLink href="/circulars" label={t("circulars")} icon={FileTextIcon} onClick={onSelect} />
      <NavLink href="/maintenance" label={t("maintenance")} icon={WrenchIcon} onClick={onSelect} />
      <NavLink href="/calendar" label={t("calendar")} icon={CalendarIcon} onClick={onSelect} />
      {isOwner ? (
        <NavLink
          href="/achievements"
          label={t("achievements")}
          icon={AwardIcon}
          onClick={onSelect}
        />
      ) : null}
      {canViewReports ? (
        <NavLink href="/reports" label={t("reports")} icon={BarChart3Icon} onClick={onSelect} />
      ) : null}
      {canManageSettings ? (
        <NavLink href="/settings" label={t("settings")} icon={SettingsIcon} onClick={onSelect} />
      ) : null}
    </nav>
  );
}
