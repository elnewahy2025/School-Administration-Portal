"use client";

import { usePathname, Link } from "@/i18n";
import { useTranslations } from "next-intl";
import { SchoolIcon, Building2Icon, MapPinIcon, UsersIcon, ShieldAlertIcon } from "lucide-react";
import { cn } from "cn";

export function SettingsNav({
  canManageSchool = true,
  canManageUsers = true,
  canViewAudit = true,
}: {
  canManageSchool?: boolean;
  canManageUsers?: boolean;
  canViewAudit?: boolean;
}) {
  const pathname = usePathname();
  const t = useTranslations("settings");

  const tabs = [
    canManageSchool ? { href: "/settings/school", label: t("school"), icon: SchoolIcon } : null,
    canManageSchool
      ? { href: "/settings/departments", label: t("departments"), icon: Building2Icon }
      : null,
    canManageSchool
      ? { href: "/settings/locations", label: t("locations"), icon: MapPinIcon }
      : null,
    canManageUsers ? { href: "/settings/users", label: t("users"), icon: UsersIcon } : null,
    canViewAudit ? { href: "/settings/audit", label: t("audit"), icon: ShieldAlertIcon } : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;

  return (
    <div className="flex overflow-x-auto border-b border-border pb-px">
      <div className="flex min-w-full gap-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
