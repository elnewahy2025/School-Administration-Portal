import { createSupabaseServerClient } from "@/lib/supabase";

export type AuditLogRow = {
  id: string;
  actor_id: string | null;
  actor_label: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
};

export async function getSchoolAuditLogs(schoolId?: string | null): Promise<AuditLogRow[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("audit_logs")
    .select("id, actor_id, actor_label, action, entity_type, entity_id, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (schoolId) {
    query = query.eq("school_id", schoolId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return (data as AuditLogRow[]) ?? [];
}
