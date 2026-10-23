"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { AppUserMenu } from "./AppUserMenu";
import { MobileNav } from "./MobileNav";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

export function AppHeader({
  profile,
  school,
  canManageSettings,
  canViewReports,
  unreadNotifications = 0,
}: {
  profile: ProfileRow | null;
  school: SchoolRow | null;
  canManageSettings: boolean;
  canViewReports: boolean;
  unreadNotifications?: number;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav
          school={school}
          canManageSettings={canManageSettings}
          canViewReports={canViewReports}
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell unreadCount={unreadNotifications} />
        <LanguageSwitcher />
        <ThemeToggle />
        <div className="h-5 w-px bg-border" />
        <AppUserMenu profile={profile} />
      </div>
    </header>
  );
}
