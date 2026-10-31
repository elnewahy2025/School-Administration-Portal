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
  canBackupRestore = false,
  unreadNotifications = 0,
}: {
  children: React.ReactNode;
  profile: ProfileRow | null;
  school: SchoolRow | null;
  isOwner?: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
  canBackupRestore?: boolean;
  unreadNotifications?: number;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>
      <AppSidebar
        school={school}
        isOwner={isOwner}
        canManageSettings={canManageSettings}
        canViewReports={canViewReports}
        canBackupRestore={canBackupRestore}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          profile={profile}
          school={school}
          isOwner={isOwner}
          canManageSettings={canManageSettings}
          canViewReports={canViewReports}
          canBackupRestore={canBackupRestore}
          unreadNotifications={unreadNotifications}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 outline-hidden sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
