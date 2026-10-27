import type { SupabaseClient } from "@supabase/supabase-js";
import { filterExcludedOwnerRows } from "./filterExcludedOwnerRows";

export async function fetchTableData(
  admin: SupabaseClient,
  tableName: string,
  schoolId?: string | null,
  ownerUserIds?: Set<string>,
): Promise<Record<string, unknown>[]> {
  let query = admin.from(tableName).select("*");

  if (schoolId) {
    if (tableName === "schools") {
      query = query.eq("id", schoolId);
    } else if (tableName === "role_permissions") {
      const { data: roles } = await admin.from("roles").select("id").eq("school_id", schoolId);
      const roleIds = (roles ?? []).map((r: { id: string }) => r.id);
      if (roleIds.length === 0) return [];
      query = query.in("role_id", roleIds);
    } else {
      query = query.eq("school_id", schoolId);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.warn(`[Backup] Failed to fetch table ${tableName}:`, error.message);
    return [];
  }

  const rows = (data as Record<string, unknown>[]) ?? [];
  return filterExcludedOwnerRows(tableName, rows, ownerUserIds);
}
