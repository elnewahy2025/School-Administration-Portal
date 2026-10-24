import { NextResponse } from "next/server";
import { withApiErrorHandler } from "@/lib/errors";
import { pingSupabaseDatabase } from "@/lib/supabase";

async function handleKeepalivePing(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await pingSupabaseDatabase();

  return NextResponse.json({
    status: "ok",
    message: "Supabase keepalive ping successful",
    ...result,
  });
}

export const GET = withApiErrorHandler(handleKeepalivePing);
export const POST = withApiErrorHandler(handleKeepalivePing);
