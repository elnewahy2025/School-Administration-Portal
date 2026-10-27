import { createSupabaseAdminClient } from "@/lib/supabase";
import { backupSchema } from "./backupSchema";
import { upsertTableRecords } from "./upsertTableRecords";
import { filterRowsForManager } from "./filterRowsForManager";
import type { BackupAccessResult } from "./assertCanManageBackup";
import type { RestoreSummary } from "./types";

import { getPlatformOwnerUserIds } from "@/lib/auth/getPlatformOwnerUserIds";

const RESTORE_ORDER = [
  "schools",
  "school_settings",
  "departments",
  "locations",
  "roles",
  "role_permissions",
  "profiles",
  "user_role_assignments",
  "school_sequences",
  "circulars",
  "circular_targets",
  "circular_responses",
  "maintenance_requests",
  "maintenance_assignments",
  "maintenance_updates",
  "calendar_events",
  "school_achievements",
] as const;

export async function restoreDatabaseBackup(
  access: BackupAccessResult,
  rawJson: unknown,
): Promise<RestoreSummary> {
  const parsed = backupSchema.safeParse(rawJson);
  if (!parsed.success) {
    throw new Error(`Invalid backup JSON format: ${parsed.error.message}`);
  }

  const payload = parsed.data;
  const admin = createSupabaseAdminClient();
  const ownerUserIds = await getPlatformOwnerUserIds();
  const tableCounts: Record<string, number> = {};
  let totalRecords = 0;

  for (const table of RESTORE_ORDER) {
    let rows = (payload.tables[table as keyof typeof payload.tables] ?? []) as Record<
      string,
      unknown
    >[];

    if (access.isManager && access.schoolId) {
      rows = filterRowsForManager(table, rows, access.schoolId, ownerUserIds);
    }

    if (rows.length > 0) {
      const count = await upsertTableRecords(admin, table, rows);
      tableCounts[table] = count;
      totalRecords += count;
    }
  }

  await admin.from("audit_logs").insert({
    school_id: access.schoolId,
    actor_id: access.userId,
    actor_label: access.userEmail,
    action: "database.restore",
    entity_type: "database",
    metadata: { totalRecords, tableCounts },
  });

  return {
    success: true,
    totalRecords,
    tableCounts,
  };
}
