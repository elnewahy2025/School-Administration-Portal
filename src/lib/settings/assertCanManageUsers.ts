import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function assertCanManageUsers(schoolId?: string | null): Promise<boolean> {
  const perms = await getEffectivePermissions().catch((): string[] => []);
  const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
  if (isOwner) return true;
  if (!schoolId) return false;
  return hasPermission("users.manage", schoolId).catch(() => false);
}
