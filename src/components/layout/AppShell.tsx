import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

export function AppShell({
  children,
  profile,
  school,
  isOwner = false,
  canManageSettings,
  canViewReports,
  unreadNotifications = 0,
}: {
  children: React.ReactNode;
  profile: ProfileRow | null;
  school: SchoolRow | null;
  isOwner?: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
  unreadNotifications?: number;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar
        school={school}
        isOwner={isOwner}
        canManageSettings={canManageSettings}
        canViewReports={canViewReports}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          profile={profile}
          school={school}
          isOwner={isOwner}
          canManageSettings={canManageSettings}
          canViewReports={canViewReports}
          unreadNotifications={unreadNotifications}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
