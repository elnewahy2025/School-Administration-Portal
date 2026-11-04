import { cookies } from "next/headers";
import { verifyBypassToken } from "@/lib/security/verifyBypassToken";
import { BYPASS_COOKIE_NAME } from "@/lib/security/bypassCookieName";

/**
 * Determines whether the portal should display the "Under Construction" page.
 *
 * Opt-in: the holding page is served only when UNDER_CONSTRUCTION="true", so a
 * deployment stays public unless it is switched on explicitly.
 *
 * A visitor holding a valid HMAC-signed bypass cookie (issued by /api/bypass
 * with UNDER_CONSTRUCTION_BYPASS_SECRET) still reaches the real portal. When no
 * bypass secret is configured, nobody can bypass the holding page.
 */
export async function isUnderConstruction(): Promise<boolean> {
  if (process.env.UNDER_CONSTRUCTION !== "true") {
    return false;
  }

  const bypassSecret = process.env.UNDER_CONSTRUCTION_BYPASS_SECRET;
  if (!bypassSecret) {
    return true;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(BYPASS_COOKIE_NAME)?.value;

  return !verifyBypassToken(cookieValue, bypassSecret);
}
