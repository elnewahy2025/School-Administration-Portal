import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getSchoolUsers } from "@/lib/school/getSchoolUsers";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { getSchoolRoles } from "@/lib/rbac/getSchoolRoles";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
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
  const [users, departments, roles, perms, hasPerm] = await Promise.all([
    getSchoolUsers(profile?.school_id),
    getSchoolDepartments(profile?.school_id),
    getSchoolRoles(profile?.school_id),
    getEffectivePermissions().catch((): string[] => []),
    profile?.school_id
      ? hasPermission("users.manage", profile.school_id).catch(() => false)
      : false,
  ]);

  const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
  const canManage = isOwner || hasPerm;

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
