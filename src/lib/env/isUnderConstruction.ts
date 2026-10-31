import { cookies } from "next/headers";

/**
 * Determines whether the portal should display the "Under Construction" page.
 *
 * Rule: Active ONLY when deployed on Vercel (not on localhost or local test stacks).
 * Can be explicitly disabled on Vercel by setting DISABLE_UNDER_CONSTRUCTION="true".
 * Can be bypassed on Vercel if a valid bypass cookie matches UNDER_CONSTRUCTION_BYPASS_SECRET.
 */
export async function isUnderConstruction(): Promise<boolean> {
  if (process.env.VERCEL !== "1") {
    return false;
  }

  if (process.env.DISABLE_UNDER_CONSTRUCTION === "true") {
    return false;
  }

  try {
    const bypassSecret = process.env.UNDER_CONSTRUCTION_BYPASS_SECRET;
    if (bypassSecret) {
      const cookieStore = await cookies();
      if (cookieStore.get("bypass_construction")?.value === bypassSecret) {
        return false;
      }
    }
  } catch {
    // Ignore contexts where cookies() is unavailable (e.g. static generation)
  }

  return true;
}
