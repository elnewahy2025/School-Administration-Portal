"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";
import { assertCanManageCirculars } from "@/lib/circulars/assertCanManageCirculars";
import { insertCircularAttachment } from "@/lib/circulars/insertCircularAttachment";
import { assertValidAttachmentRecord } from "@/lib/circulars/assertValidAttachmentRecord";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { NotFoundError } from "@/lib/errors/NotFoundError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export interface RecordCircularAttachmentParams {
  circularId: string;
  path: string;
  mime: string | null;
  sizeBytes: number | null;
}

export async function recordCircularAttachmentAction(
  params: RecordCircularAttachmentParams,
): Promise<ActionResult> {
  try {
    const auth = await assertCanManageCirculars();
    if (!auth.authorized) {
      throw new ForbiddenError(auth.error);
    }

    assertValidAttachmentRecord(params, auth.schoolId);

    const supabase = auth.isOwner
      ? createSupabaseAdminClient({ actorId: auth.profileId })
      : await createSupabaseServerClient();

    const { data: circular, error: circError } = await supabase
      .from("circulars")
      .select("id")
      .eq("id", params.circularId)
      .eq("school_id", auth.schoolId)
      .maybeSingle();

    if (circError) {
      throw mapDatabaseError(circError);
    }
    if (!circular) {
      throw new NotFoundError("Circular not found");
    }

    const insertResult = await insertCircularAttachment(supabase, {
      circularId: params.circularId,
      schoolId: auth.schoolId,
      path: params.path,
      mime: params.mime,
      sizeBytes: params.sizeBytes,
      uploadedBy: auth.profileId,
    });

    if (insertResult.error) {
      throw mapDatabaseError({ message: insertResult.error });
    }

    revalidatePath("/[locale]/circulars", "page");
    revalidatePath(`/[locale]/circulars/${params.circularId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
