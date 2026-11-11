"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { assertCanManageCalendar } from "@/lib/calendar/assertCanManageCalendar";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { deleteCalendarEventRecord } from "@/lib/calendar/deleteCalendarEventRecord";
import { ValidationError } from "@/lib/errors/ValidationError";
import { DatabaseError } from "@/lib/errors/DatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function deleteCalendarEventAction(eventId: string): Promise<ActionResult> {
  try {
    if (!eventId || typeof eventId !== "string" || !eventId.trim()) {
      throw new ValidationError("Event ID is required");
    }

    const auth = await assertCanManageCalendar();
    const isOwner = await isPlatformOwner(auth.profileId);
    const supabase = await createSupabaseServerClient();

    const res = await deleteCalendarEventRecord(supabase, {
      eventId: eventId.trim(),
      schoolId: auth.schoolId,
      actorId: auth.profileId,
      isOwner,
    });

    if (!res.success) {
      throw new DatabaseError(res.error || "Failed to delete calendar event");
    }

    revalidatePath("/[locale]/calendar", "page");
    revalidatePath(`/[locale]/calendar/${eventId}`, "page");
    revalidatePath("/[locale]", "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
