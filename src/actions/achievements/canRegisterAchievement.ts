import { hasPermission } from "@/lib/rbac/hasPermission";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";

export async function canRegisterAchievement(
  schoolId: string | null | undefined,
  userDeptId: string | null | undefined,
  targetDeptId: string | null,
): Promise<boolean> {
  if (!schoolId) return false;
  const perms: string[] = await getEffectivePermissions().catch(() => []);
  if (perms.includes("settings.platform.update") || perms.includes("roles.manage")) {
    return true;
  }
  const allowed = await hasPermission("calendar.manage", schoolId);
  if (allowed) return true;
  return Boolean(targetDeptId && userDeptId === targetDeptId);
}
