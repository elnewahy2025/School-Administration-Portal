"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function deleteAllNotificationsAction(): Promise<ActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userRes, error: userError } = await supabase.auth.getUser();
    if (userError || !userRes?.user) {
      throw new AuthenticationError("Unauthorized");
    }

    const admin = createSupabaseAdminClient({ actorId: userRes.user.id });
    const { error } = await admin
      .from("notifications")
      .delete()
      .eq("user_id", userRes.user.id);

    if (error) {
      throw mapDatabaseError(error);
    }

    revalidatePath("/[locale]/notifications", "page");
    revalidatePath("/[locale]", "layout");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}

