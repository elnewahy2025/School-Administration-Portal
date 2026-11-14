"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { dispatchCircularNotification } from "@/lib/circulars/dispatchCircularNotification";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function publishCircularAction(circularId: string): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      throw new AuthenticationError("No school associated with profile");
    }

    const allowed = await hasPermission("circular.publish", profile.school_id);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("circulars")
      .update({
        status: "published",
        publish_at: new Date().toISOString(),
      })
      .eq("id", circularId)
      .eq("school_id", profile.school_id);

    if (error) {
      throw mapDatabaseError(error);
    }

    void dispatchCircularNotification(supabase, {
      schoolId: profile.school_id,
      circularId,
      publisherId: profile.id,
    });

    revalidatePath("/[locale]/circulars", "page");
    revalidatePath(`/[locale]/circulars/${circularId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
