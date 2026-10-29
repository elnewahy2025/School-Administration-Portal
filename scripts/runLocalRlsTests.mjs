// Runs the RLS harness + battery against the LOCAL Supabase stack only.
//
// Production incident (2026-10-28): `test:rls` loaded `.env.local`, which points
// at the hosted project, so a destructive fixture test wrote to production.
// This runner reads the credentials from the local CLI and refuses any
// non-loopback host.
import { spawnSync } from "node:child_process";
import { readLocalSupabaseEnv } from "./readLocalSupabaseEnv.mjs";
import { assertLocalSupabaseUrl } from "./assertLocalSupabaseUrl.mjs";

const SUITES = ["supabase/tests/rls.harness.test.mjs", "supabase/tests/rls.battery.test.mjs"];

export function runLocalRlsTests() {
  const env = readLocalSupabaseEnv();
  const url = assertLocalSupabaseUrl(env.API_URL ?? env.SUPABASE_URL);
  const anonKey = env.ANON_KEY ?? "";
  const serviceKey = env.SERVICE_ROLE_KEY ?? "";

  if (!anonKey || !serviceKey) {
    console.error("The local stack did not report an anon/service key. Refusing to run.");
    process.exit(1);
  }

  const childEnv = {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceKey,
  };

  console.log(`RLS target: ${url} (local)`);

  for (const file of SUITES) {
    const result = spawnSync(process.execPath, [file], { env: childEnv, stdio: "inherit" });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}

try {
  runLocalRlsTests();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
