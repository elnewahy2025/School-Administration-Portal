import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { resolveSchoolForCaller } from "@/lib/school/resolveSchoolForCaller";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";

export async function assertCanAssignMaintenance(): Promise<{
  schoolId: string;
  profileId: string;
}> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new AuthenticationError("Unauthorized");
  }

  const schoolId = await resolveSchoolForCaller(profile);
  if (!schoolId) {
    throw new AuthenticationError("No school associated with profile");
  }

  const isOwner = await isPlatformOwner(profile.id);
  const allowed = isOwner || (await hasPermission("maintenance.assign", schoolId));
  if (!allowed) {
    throw new ForbiddenError("Unauthorized");
  }

  return { schoolId, profileId: profile.id };
}
