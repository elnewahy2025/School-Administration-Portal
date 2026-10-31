import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

export type SupabaseAdminClientOptions = {
  actorId?: string | null;
  actorLabel?: string | null;
};

export function createSupabaseAdminClient(options?: SupabaseAdminClientOptions) {
  const env = getServerEnv();
  const headers: Record<string, string> = {};
  if (options?.actorId) {
    headers["x-actor-id"] = options.actorId;
  }
  if (options?.actorLabel) {
    headers["x-actor-label"] = options.actorLabel;
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers },
  });
}
