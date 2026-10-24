import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolUsers } from "@/lib/school/getSchoolUsers";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { getSchoolRoles } from "@/lib/rbac/getSchoolRoles";
import { assertCanManageUsers } from "@/lib/settings/assertCanManageUsers";
import { UserRolesManager } from "@/components/rbac/UserRolesManager";

export default async function UsersSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");

  const profile = await getCurrentProfile();
  const canManage = await assertCanManageUsers(profile?.school_id);

  if (!canManage) {
    redirect({ href: "/settings", locale });
  }

  const [users, departments, roles] = await Promise.all([
    getSchoolUsers(profile?.school_id),
    getSchoolDepartments(profile?.school_id),
    getSchoolRoles(profile?.school_id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("users")}</h2>
        <p className="text-sm text-muted-foreground">{t("usersDesc")}</p>
      </div>

      <UserRolesManager
        users={users}
        departments={departments}
        roles={roles}
        currentUserId={profile?.id}
        canManage={canManage}
      />
    </div>
  );
}
