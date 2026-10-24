import { canRegisterAchievement } from "./canRegisterAchievement";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";

export async function assertCanRegisterAchievement(
  profile: { id: string; school_id: string | null; department_id: string | null } | null,
  targetDepartmentId?: string | null,
): Promise<{ schoolId: string; profileId: string }> {
  if (!profile?.school_id) {
    throw new ForbiddenError("Unauthorized");
  }

  const isAuthorized = await canRegisterAchievement(
    profile.school_id,
    profile.department_id,
    targetDepartmentId ?? null,
    profile.id,
  );

  if (!isAuthorized) {
    throw new ForbiddenError("Unauthorized");
  }

  return { schoolId: profile.school_id, profileId: profile.id };
}
