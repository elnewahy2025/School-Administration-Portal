import { hasPermission } from "@/lib/rbac/hasPermission";

export async function canRegisterAchievement(
  schoolId: string | null | undefined,
  userDeptId: string | null | undefined,
  targetDeptId: string | null,
): Promise<boolean> {
  if (!schoolId) return false;
  const allowed = await hasPermission("calendar.manage", schoolId);
  if (allowed) return true;
  return Boolean(targetDeptId && userDeptId === targetDeptId);
}
