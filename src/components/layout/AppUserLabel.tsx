import type { ProfileRow } from "@/lib/auth/getCurrentProfile";

export function AppUserLabel({ profile }: { profile: ProfileRow | null }) {
  const displayName = profile?.full_name ?? "User";
  return (
    <div className="flex flex-col space-y-1">
      <p className="text-sm leading-none font-medium">{displayName}</p>
      {Boolean(profile?.email) && (
        <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
      )}
      {Boolean(profile?.job_title) && (
        <p className="text-xs text-muted-foreground">{profile?.job_title}</p>
      )}
    </div>
  );
}
