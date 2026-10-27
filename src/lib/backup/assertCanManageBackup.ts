import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";

export type BackupAccessResult = {
  allowed: boolean;
  isOwner: boolean;
  isManager: boolean;
  schoolId: string | null;
  userId: string | null;
  userEmail: string | null;
};

export async function assertCanManageBackup(): Promise<BackupAccessResult> {
  const profile = await getCurrentProfile();
  if (!profile) {
    return {
      allowed: false,
      isOwner: false,
      isManager: false,
      schoolId: null,
      userId: null,
      userEmail: null,
    };
  }

  const isOwner = await isPlatformOwner(profile.id);

  return {
    allowed: isOwner,
    isOwner,
    isManager: false,
    schoolId: profile.school_id,
    userId: profile.id,
    userEmail: profile.email,
  };
}
