/**
 * Enforces strict tenant isolation for school managers during database restore,
 * preventing any owner data or foreign school data from being processed.
 */
export function filterRowsForManager(
  table: string,
  rows: Record<string, unknown>[],
  managerSchoolId: string,
  ownerUserIds?: Set<string>,
): Record<string, unknown>[] {
  if (table === "schools") {
    return rows.filter((r) => r.id === managerSchoolId);
  }

  if (table === "roles") {
    return rows.filter(
      (r) => r.school_id === managerSchoolId && !r.is_system && r.key !== "owner",
    );
  }

  let filtered = rows;
  if (table === "profiles" && ownerUserIds && ownerUserIds.size > 0) {
    filtered = filtered.filter((r) => !ownerUserIds.has(r.id as string));
  }

  if (table === "user_role_assignments" && ownerUserIds && ownerUserIds.size > 0) {
    filtered = filtered.filter((r) => !ownerUserIds.has(r.user_id as string));
  }

  return filtered
    .filter((r) => {
      if ("school_id" in r) {
        return r.school_id === managerSchoolId || r.school_id === null;
      }
      return true;
    })
    .map((r) => ("school_id" in r ? { ...r, school_id: managerSchoolId } : r));
}
