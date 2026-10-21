import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getClientEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getClientEnv();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value } of cookiesToSet) cookieStore.set(name, value);
        } catch {
          // Called from a Server Component: cookies cannot be set there.
        }
      },
    },
  });
}
