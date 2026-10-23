import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { Toaster } from "@/components/ui/sonner";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

export function AppShell({
  children,
  profile,
  school,
  canManageSettings,
  canViewReports,
}: {
  children: React.ReactNode;
  profile: ProfileRow | null;
  school: SchoolRow | null;
  canManageSettings: boolean;
  canViewReports: boolean;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar
        school={school}
        canManageSettings={canManageSettings}
        canViewReports={canViewReports}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          profile={profile}
          school={school}
          canManageSettings={canManageSettings}
          canViewReports={canViewReports}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
