import { hasPermission } from "@/lib/rbac/hasPermission";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { getUserRoleKey } from "@/lib/rbac/getUserRoleKey";

export async function canRegisterAchievement(
  schoolId: string | null | undefined,
  userDeptId: string | null | undefined,
  targetDeptId: string | null,
  userId?: string | null,
): Promise<boolean> {
  if (!schoolId) return false;
  const perms: string[] = await getEffectivePermissions().catch((): string[] => []);
  if (perms.includes("settings.platform.update") || perms.includes("roles.manage")) {
    return true;
  }
  const allowed = await hasPermission("calendar.manage", schoolId);
  if (allowed) return true;

  if (userId && targetDeptId && userDeptId === targetDeptId) {
    const roleKey = await getUserRoleKey(userId, schoolId);
    return roleKey === "department_head";
  }

  return false;
}
