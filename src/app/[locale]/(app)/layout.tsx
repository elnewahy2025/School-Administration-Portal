import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getCurrentSchool } from "@/lib/school/getCurrentSchool";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { getUnreadNotificationCount } from "@/lib/notifications/getUnreadNotificationCount";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { resolveLayoutNavigationAccess } from "@/lib/auth/resolveLayoutNavigationAccess";
import { assertCanManageBackup } from "@/lib/backup";
import { AppShell } from "@/components/layout";
import { RealtimeNotificationListener } from "@/components/notifications";

export default async function AuthenticatedAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  if (!user) {
    redirect({ href: "/login", locale });
  }

  const profile = await getCurrentProfile();
  if (!profile || !profile.is_active) {
    redirect({ href: "/login", locale });
  }

  const [school, permissions, unreadNotifications, isOwner, backupAccess] = await Promise.all([
    getCurrentSchool(profile?.school_id),
    getEffectivePermissions().catch(() => []),
    getUnreadNotificationCount().catch(() => 0),
    profile?.id ? isPlatformOwner(profile.id) : Promise.resolve(false),
    assertCanManageBackup().catch(() => ({ allowed: false })),
  ]);

  const { canViewReports, canManageSettings } = resolveLayoutNavigationAccess(
    isOwner,
    permissions,
    Boolean(profile?.school_id),
  );
  const canBackupRestore = backupAccess.allowed;

  return (
    <>
      {profile?.id && <RealtimeNotificationListener userId={profile.id} />}
      <AppShell
        profile={profile}
        school={school}
        isOwner={isOwner}
        canManageSettings={canManageSettings}
        canViewReports={canViewReports}
        canBackupRestore={canBackupRestore}
        unreadNotifications={unreadNotifications}
      >
        {children}
      </AppShell>
    </>
  );
}
