import type { SupabaseClient } from "@supabase/supabase-js";

const CONFLICT_KEYS: Record<string, string> = {
  school_settings: "school_id",
  role_permissions: "role_id,permission_key",
  school_sequences: "school_id,kind,year",
};

export async function upsertTableRecords(
  admin: SupabaseClient,
  table: string,
  records?: Record<string, unknown>[],
): Promise<number> {
  if (!records || records.length === 0) return 0;

  const onConflict = CONFLICT_KEYS[table] || "id";
  const chunkSize = 100;
  let count = 0;

  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    const { error } = await admin.from(table).upsert(chunk, { onConflict });

    if (error) {
      console.warn(`[Restore] Error upserting table ${table}:`, error.message);
      throw new Error(`Failed to restore table ${table}: ${error.message}`);
    }
    count += chunk.length;
  }

  return count;
}
