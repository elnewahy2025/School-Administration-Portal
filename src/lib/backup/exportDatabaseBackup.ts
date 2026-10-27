import { createSupabaseAdminClient } from "@/lib/supabase";
import { getPlatformOwnerUserIds } from "@/lib/auth/getPlatformOwnerUserIds";
import { fetchTableData } from "./fetchTableData";
import type { BackupAccessResult } from "./assertCanManageBackup";
import type { DatabaseBackupPayload } from "./types";

const BACKUP_TABLES = [
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

export async function exportDatabaseBackup(
  access: BackupAccessResult,
): Promise<DatabaseBackupPayload> {
  const admin = createSupabaseAdminClient();
  const schoolId = access.schoolId;
  const scope = schoolId ? "school" : "platform";

  const [school, ownerUserIds] = await Promise.all([
    schoolId
      ? admin
          .from("schools")
          .select("name_ar, name_en")
          .eq("id", schoolId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    getPlatformOwnerUserIds(),
  ]);

  const schoolName = (school.data?.name_ar || school.data?.name_en) ?? null;

  const tableResults = await Promise.all(
    BACKUP_TABLES.map(async (table) => {
      const rows = await fetchTableData(admin, table, schoolId, ownerUserIds);
      return [table, rows] as const;
    }),
  );

  const tables: DatabaseBackupPayload["tables"] = Object.fromEntries(tableResults);

  return {
    metadata: {
      version: 1,
      exportedAt: new Date().toISOString(),
      exportedBy: access.userId ?? "system",
      scope,
      schoolId: schoolId ?? null,
      schoolName,
    },
    tables,
  };
}
