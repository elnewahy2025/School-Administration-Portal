import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getCurrentSchool } from "@/lib/school/getCurrentSchool";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";

export type ManageCircularAuthResult =
  | {
      authorized: true;
      profileId: string;
      schoolId: string;
      error?: never;
    }
  | {
      authorized: false;
      error: string;
      profileId?: never;
      schoolId?: never;
    };

export async function assertCanManageCirculars(): Promise<ManageCircularAuthResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { authorized: false, error: "Unauthorized" };

  const school = await getCurrentSchool(profile.school_id);
  if (!school) return { authorized: false, error: "No school associated with profile" };

  const perms = await getEffectivePermissions().catch((): string[] => []);
  const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
  const canManage =
    isOwner || perms.includes("circular.create") || perms.includes("circular.publish");
  if (!canManage) return { authorized: false, error: "Unauthorized" };

  return { authorized: true, profileId: profile.id, schoolId: school.id };
}
