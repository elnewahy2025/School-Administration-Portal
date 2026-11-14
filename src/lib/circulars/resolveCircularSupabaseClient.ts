import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";

export async function resolveCircularSupabaseClient(auth: {
  isOwner?: boolean;
  profileId: string;
}) {
  return auth.isOwner
    ? createSupabaseAdminClient({ actorId: auth.profileId })
    : await createSupabaseServerClient();
}
