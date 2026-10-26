import type {
  DashboardComplianceCircularItem,
  DashboardDepartmentComplianceSlice,
} from "./types";

export function resolveCircularSlices(
  baseSlices: DashboardDepartmentComplianceSlice[],
  circular: DashboardComplianceCircularItem,
): DashboardDepartmentComplianceSlice[] {
  const respondedSet = new Set(circular.respondedDepartments.map((d) => d.id));
  const pendingSet = new Set(circular.pendingDepartments.map((d) => d.id));

  return baseSlices
    .filter((s) => respondedSet.has(s.id) || pendingSet.has(s.id))
    .map((s) => {
      const hasResponded = respondedSet.has(s.id);
      return {
        ...s,
        targetedCount: 1,
        respondedCount: hasResponded ? 1 : 0,
        pendingCount: hasResponded ? 0 : 1,
        complianceRate: hasResponded ? 100 : 0,
      };
    });
}
