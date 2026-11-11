import { isCurrentUserPlatformOwner } from "@/lib/auth/isCurrentUserPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";

export async function resolveMaintenanceListPermissions(profile: ProfileRow | null): Promise<{
  canCreate: boolean;
  canManageAll: boolean;
}> {
  if (!profile) return { canCreate: false, canManageAll: false };

  const isOwner = await isCurrentUserPlatformOwner(profile.id);
  if (isOwner) return { canCreate: true, canManageAll: true };

  const schoolId = profile.school_id;
  if (!schoolId) return { canCreate: false, canManageAll: false };

  const deptId = profile.department_id;
  const [canCreatePerm, canAssignPerm, canClosePerm, canManageUsersPerm] = await Promise.all([
    hasPermission("maintenance.create", schoolId, deptId).catch(() => false),
    hasPermission("maintenance.assign", schoolId).catch(() => false),
    hasPermission("maintenance.close", schoolId).catch(() => false),
    hasPermission("users.manage", schoolId).catch(() => false),
  ]);

  return {
    canCreate: canCreatePerm,
    canManageAll: canAssignPerm || canClosePerm || canManageUsersPerm,
  };
}
