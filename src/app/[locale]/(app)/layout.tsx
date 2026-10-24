import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getCurrentSchool } from "@/lib/school/getCurrentSchool";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { getUnreadNotificationCount } from "@/lib/notifications/getUnreadNotificationCount";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { resolveLayoutNavigationAccess } from "@/lib/auth/resolveLayoutNavigationAccess";
import { AppShell } from "@/components/layout";

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
  const school = await getCurrentSchool(profile?.school_id);
  const permissions: string[] = await getEffectivePermissions().catch(() => []);
  const unreadNotifications = await getUnreadNotificationCount().catch(() => 0);
  const isPlatformOwnerUser = profile?.id ? await isPlatformOwner(profile.id) : false;

  const isOwner =
    isPlatformOwnerUser ||
    permissions.includes("settings.platform.update") ||
    permissions.includes("roles.manage");

  const { canViewReports, canManageSettings } = resolveLayoutNavigationAccess(
    isOwner,
    permissions,
    Boolean(profile?.school_id),
  );

  return (
    <AppShell
      profile={profile}
      school={school}
      isOwner={isOwner}
      canManageSettings={canManageSettings}
      canViewReports={canViewReports}
      unreadNotifications={unreadNotifications}
    >
      {children}
    </AppShell>
  );
}
