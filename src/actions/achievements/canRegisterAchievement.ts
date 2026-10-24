import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";

export async function canRegisterAchievement(
  schoolId: string | null | undefined,
  _userDeptId: string | null | undefined,
  _targetDeptId: string | null,
  userId?: string | null,
): Promise<boolean> {
  if (!schoolId || !userId) return false;
  return isPlatformOwner(userId);
}
