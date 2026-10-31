import type { ProfileRow } from "@/lib/auth/getCurrentProfile";

export interface ActorDetails {
  actorId?: string;
  actorLabel?: string;
}

export function getActorDetails(profile?: ProfileRow | null): ActorDetails {
  if (!profile) {
    return { actorLabel: "system" };
  }

  const label = profile.full_name
    ? `${profile.full_name} (${profile.email || ""})`
    : profile.email || "system";

  return {
    actorId: profile.id,
    actorLabel: label,
  };
}

