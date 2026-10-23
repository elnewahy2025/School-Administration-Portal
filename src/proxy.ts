import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n";
import { refreshSession } from "@/lib/supabase/refreshSession";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Locale negotiation first (may return a redirect), then refresh the Supabase
  // session so rotated tokens are written onto whichever response is returned.
  const response = intlMiddleware(request);
  return refreshSession(request, response);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
