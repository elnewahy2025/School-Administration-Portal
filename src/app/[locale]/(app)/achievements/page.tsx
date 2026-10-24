import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { getSchoolAchievements } from "@/lib/achievements/getSchoolAchievements";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { SchoolAchievementsHub } from "@/components/achievements/SchoolAchievementsHub";

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect({ href: "/login", locale });
    return null;
  }

  const [permissions, isPlatformOwnerUser] = await Promise.all([
    getEffectivePermissions().catch((): string[] => []),
    isPlatformOwner(profile.id),
  ]);

  const isOwner =
    isPlatformOwnerUser ||
    permissions.includes("settings.platform.update") ||
    permissions.includes("roles.manage");

  if (!isOwner) {
    redirect({ href: "/dashboard", locale });
    return null;
  }

  const schoolId = profile.school_id;
  const [achievements, departments] = await Promise.all([
    getSchoolAchievements(schoolId),
    getSchoolDepartments(schoolId),
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <SchoolAchievementsHub
        achievements={achievements}
        departments={departments}
        canManage={true}
      />
    </div>
  );
}
