import type { AuditLogFilters } from "./getSchoolAuditLogs";

export function applyAuditQueryFilters<T>(
  query: T,
  schoolId?: string | null,
  filters?: AuditLogFilters,
): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = query;
  if (schoolId) {
    q = q.eq("school_id", schoolId);
  }
  if (!filters) {
    return q;
  }
  if (filters.action) {
    q = q.ilike("action", `%${filters.action}%`);
  }
  if (filters.entityType) {
    q = q.eq("entity_type", filters.entityType);
  }
  if (filters.actorLabel) {
    q = q.ilike("actor_label", `%${filters.actorLabel}%`);
  }
  if (filters.startDate) {
    q = q.gte("created_at", filters.startDate);
  }
  if (filters.endDate) {
    q = q.lte("created_at", filters.endDate);
  }
  return q;
}
