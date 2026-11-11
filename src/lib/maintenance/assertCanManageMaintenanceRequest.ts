import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { MaintenanceRequestRow } from "./types";

export async function assertCanManageMaintenanceRequest(
  profile: ProfileRow,
  ticket: MaintenanceRequestRow,
  actionName = "manage",
): Promise<void> {
  const isOwner = await isPlatformOwner(profile.id);
  if (isOwner) return;

  if (!profile.school_id || profile.school_id !== ticket.school_id) {
    throw new ForbiddenError(`Unauthorized to ${actionName} maintenance request`);
  }

  if (ticket.reporter_id === profile.id) return;

  const schoolId = profile.school_id;
  const ticketDeptId = ticket.reporter_department_id;
  const [canClose, canAssign, canManageUsers] = await Promise.all([
    hasPermission("maintenance.close", schoolId, ticketDeptId),
    hasPermission("maintenance.assign", schoolId, ticketDeptId),
    hasPermission("users.manage", schoolId, ticketDeptId),
  ]);

  if (!canClose && !canAssign && !canManageUsers) {
    throw new ForbiddenError(`Unauthorized to ${actionName} maintenance request`);
  }
}
