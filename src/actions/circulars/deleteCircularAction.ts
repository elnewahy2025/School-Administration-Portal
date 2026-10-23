"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { deleteCircularRecord } from "@/lib/circulars/deleteCircularRecord";
import { assertCanManageCirculars } from "@/lib/circulars/assertCanManageCirculars";

export async function deleteCircularAction(circularId: string) {
  const auth = await assertCanManageCirculars();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = await createSupabaseServerClient();
  const res = await deleteCircularRecord(supabase, circularId);
  if (!res.success) {
    return { success: false, error: res.error || "Failed to delete circular" };
  }

  revalidatePath("/[locale]/circulars", "page");
  return { success: true };
}
