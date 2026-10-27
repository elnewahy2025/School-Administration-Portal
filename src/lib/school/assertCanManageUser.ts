import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";

export type ManageUserPermissionResult = {
  allowed: boolean;
  schoolId?: string;
  currentUserId?: string;
  error?: string;
};

export async function assertCanManageUser(
  targetUserId: string,
  targetRoleKey?: string | null,
): Promise<ManageUserPermissionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { allowed: false, error: "No school associated with profile" };
  }

  if (await isPlatformOwner(targetUserId)) {
    return { allowed: false, error: "Cannot modify system-protected account" };
  }

  if (targetRoleKey === "owner") {
    return { allowed: false, error: "Invalid role selection" };
  }

  const permitted = await hasPermission("users.manage", profile.school_id);
  if (!permitted) {
    return { allowed: false, error: "Unauthorized" };
  }

  return { allowed: true, schoolId: profile.school_id, currentUserId: profile.id };
}
