"use server";

import {
  assertCanManageBackup,
  exportDatabaseBackup,
  type DatabaseBackupPayload,
} from "@/lib/backup";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export type ExportBackupResult = ActionResult & {
  backup?: DatabaseBackupPayload;
};

export async function exportBackupAction(): Promise<ExportBackupResult> {
  try {
    const access = await assertCanManageBackup();
    if (!access.allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const backup = await exportDatabaseBackup(access);
    return { success: true, backup };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
