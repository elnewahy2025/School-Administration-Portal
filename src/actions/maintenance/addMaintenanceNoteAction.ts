"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { parseMaintenanceNoteData } from "@/lib/validation/parseMaintenanceNoteData";
import { insertMaintenanceUpdate } from "@/lib/maintenance/insertMaintenanceUpdate";
import { assertCanAddNote } from "@/lib/maintenance/assertCanAddNote";

export async function addMaintenanceNoteAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const { requestId, note } = parseMaintenanceNoteData(formData);
  if (!requestId || !note.trim()) {
    return { success: false, error: "Note cannot be empty" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: ticket } = await supabase
    .from("maintenance_requests")
    .select("id, school_id, reporter_id, assigned_operator_id")
    .eq("id", requestId)
    .single();

  if (!ticket) {
    return { success: false, error: "Ticket not found" };
  }

  const canAdd = await assertCanAddNote(
    profile.school_id,
    profile.id,
    ticket.reporter_id,
    ticket.assigned_operator_id,
  );
  if (!canAdd) {
    return { success: false, error: "Unauthorized to add notes" };
  }

  const res = await insertMaintenanceUpdate(supabase, {
    requestId,
    schoolId: profile.school_id,
    authorId: profile.id,
    kind: "note",
    reason: note.trim(),
  });

  if (res.error) return { success: false, error: res.error };

  revalidatePath(`/[locale]/maintenance/${requestId}`, "page");
  return { success: true };
}
