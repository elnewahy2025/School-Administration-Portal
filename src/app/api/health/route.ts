import { NextResponse } from "next/server";
import { withApiErrorHandler } from "@/lib/errors";
import { getBuildVersion } from "@/lib/health/getBuildVersion";
import { pingSupabaseDatabase } from "@/lib/supabase";

/**
 * Liveness probe, with an opt-in dependency check.
 *
 * `GET /api/health` answers without touching anything, so an uptime monitor can
 * tell "process is down" apart from "database is down". `GET /api/health?deep=1`
 * additionally runs one query and returns 503 when it fails, which is what the
 * external check should use.
 */
async function handleHealth(request: Request) {
  const url = new URL(request.url);
  const version = getBuildVersion();

  if (url.searchParams.get("deep") !== "1") {
    return NextResponse.json({ status: "ok", version, database: "not-checked" });
  }

  const ping = await pingSupabaseDatabase();

  return NextResponse.json(
    {
      status: ping.success ? "ok" : "degraded",
      version,
      database: ping.success ? "ok" : "unreachable",
      latencyMs: ping.latencyMs,
    },
    { status: ping.success ? 200 : 503 },
  );
}

export const GET = withApiErrorHandler(handleHealth);
