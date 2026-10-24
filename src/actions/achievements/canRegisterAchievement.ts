import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";

export async function canRegisterAchievement(
  schoolId: string | null | undefined,
  _userDeptId: string | null | undefined,
  _targetDeptId: string | null,
  userId?: string | null,
): Promise<boolean> {
  if (!schoolId) return false;
  if (userId && (await isPlatformOwner(userId))) {
    return true;
  }
  const perms: string[] = await getEffectivePermissions().catch((): string[] => []);
  return perms.includes("settings.platform.update") || perms.includes("roles.manage");
}
