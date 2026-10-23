import { getCurrentProfile, type ProfileRow } from "@/lib/auth/getCurrentProfile";
import { getCurrentSchool } from "@/lib/school/getCurrentSchool";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";

export type AssertCanViewReportsResult =
  | { authorized: false; error: string }
  | {
      authorized: true;
      profile: ProfileRow;
      schoolId: string;
      scopedDepartmentId: string | null;
    };

export async function assertCanViewReports(): Promise<AssertCanViewReportsResult> {
  const profile = await getCurrentProfile();
  if (!profile) {
    return { authorized: false, error: "Unauthorized" };
  }

  const school = await getCurrentSchool(profile.school_id);
  if (!school) {
    return { authorized: false, error: "No school associated with profile" };
  }

  const perms = await getEffectivePermissions().catch((): string[] => []);
  const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
  const allowed = isOwner || perms.includes("reports.view");
  if (!allowed) {
    return { authorized: false, error: "Unauthorized" };
  }

  const canViewAll =
    isOwner || perms.includes("settings.school.update") || perms.includes("audit.view");

  return {
    authorized: true,
    profile,
    schoolId: school.id,
    scopedDepartmentId: canViewAll ? null : profile.department_id,
  };
}
