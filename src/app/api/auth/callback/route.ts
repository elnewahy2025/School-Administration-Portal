import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { sanitizeError } from "@/lib/errors/sanitizeError";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, request.url));
      }
      sanitizeError(error, { endpoint: "/api/auth/callback" });
    } catch (err: unknown) {
      sanitizeError(err, { endpoint: "/api/auth/callback" });
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", request.url));
}
