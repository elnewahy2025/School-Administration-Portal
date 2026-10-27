"use server";

import { revalidatePath } from "next/cache";
import { assertCanManageBackup, restoreDatabaseBackup, type RestoreSummary } from "@/lib/backup";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export type RestoreBackupResult = ActionResult & {
  summary?: RestoreSummary;
};

export async function restoreBackupAction(jsonPayload: unknown): Promise<RestoreBackupResult> {
  try {
    const access = await assertCanManageBackup();
    if (!access.allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const summary = await restoreDatabaseBackup(access, jsonPayload);

    revalidatePath("/", "layout");

    return { success: true, summary };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
