import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getCurrentSchool } from "@/lib/school/getCurrentSchool";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
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

  const canViewReports = permissions.includes("reports.view");
  const canManageSettings =
    permissions.some(
      (p) =>
        p.startsWith("settings.") ||
        p === "users.manage" ||
        p === "roles.manage" ||
        p === "audit.view",
    ) || profile?.school_id === null;

  return (
    <AppShell
      profile={profile}
      school={school}
      canManageSettings={canManageSettings}
      canViewReports={canViewReports}
    >
      {children}
    </AppShell>
  );
}
