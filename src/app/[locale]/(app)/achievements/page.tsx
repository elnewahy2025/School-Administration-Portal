import { setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { getUserRoleKey } from "@/lib/rbac/getUserRoleKey";
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
  const schoolId = profile?.school_id;

  const [permissions, hasManagePerm, achievements, departments, roleKey] = await Promise.all([
    getEffectivePermissions().catch((): string[] => []),
    schoolId ? hasPermission("calendar.manage", schoolId).catch(() => false) : false,
    getSchoolAchievements(schoolId),
    getSchoolDepartments(schoolId),
    getUserRoleKey(profile?.id, schoolId),
  ]);

  const isOwner =
    permissions.includes("settings.platform.update") || permissions.includes("roles.manage");
  const canManage = isOwner || hasManagePerm || roleKey === "department_head";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <SchoolAchievementsHub
        achievements={achievements}
        departments={departments}
        canManage={canManage}
      />
    </div>
  );
}
