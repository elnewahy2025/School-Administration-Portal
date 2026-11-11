import { isCurrentUserPlatformOwner } from "@/lib/auth/isCurrentUserPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { MaintenanceRequestRow } from "./types";

export async function resolveMaintenanceDetailPermissions(
  profile: ProfileRow,
  ticket: MaintenanceRequestRow,
): Promise<{
  canAssign: boolean;
  canClose: boolean;
  isReporter: boolean;
  isOperator: boolean;
  isParticipant: boolean;
  canManage: boolean;
}> {
  const isReporter = ticket.reporter_id === profile.id;
  const isOperator = ticket.assigned_operator_id === profile.id;
  const isOwner = await isCurrentUserPlatformOwner(profile.id);

  if (isOwner) {
    return {
      canAssign: true,
      canClose: true,
      isReporter,
      isOperator,
      isParticipant: true,
      canManage: true,
    };
  }

  const schoolId = profile.school_id;
  const ticketDeptId = ticket.reporter_department_id;
  const [canAssign, canClose, canManageUsers] = await Promise.all([
    hasPermission("maintenance.assign", schoolId, ticketDeptId).catch(() => false),
    hasPermission("maintenance.close", schoolId, ticketDeptId).catch(() => false),
    hasPermission("users.manage", schoolId, ticketDeptId).catch(() => false),
  ]);

  const isParticipant = isReporter || isOperator || canAssign;
  const canManage = canAssign || canClose || canManageUsers || isReporter;

  return {
    canAssign,
    canClose,
    isReporter,
    isOperator,
    isParticipant,
    canManage,
  };
}
