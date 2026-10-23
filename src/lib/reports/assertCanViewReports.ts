import { getCurrentProfile, type ProfileRow } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";

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
  if (!profile?.school_id) {
    return { authorized: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("reports.view", profile.school_id);
  if (!allowed) {
    return { authorized: false, error: "Unauthorized" };
  }

  // Check if user has global school admin or audit privileges
  const canViewAll =
    (await hasPermission("settings.school.update", profile.school_id)) ||
    (await hasPermission("audit.view", profile.school_id));

  const scopedDepartmentId = canViewAll ? null : profile.department_id;

  return {
    authorized: true,
    profile,
    schoolId: profile.school_id,
    scopedDepartmentId,
  };
}
