import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { DepartmentComplianceItem } from "./types";

interface TargetItem {
  circular_id: string;
  department_id: string | null;
}

interface ResponseItem {
  circular_id: string;
  department_id: string;
  status: string;
}

export function computeDepartmentCompliance({
  departments,
  targets,
  responses,
}: {
  departments: DepartmentRow[];
  targets: TargetItem[];
  responses: ResponseItem[];
}): DepartmentComplianceItem[] {
  return departments.map((dept) => {
    const deptTargets = targets.filter((t) => t.department_id === dept.id);
    const targetedCount = deptTargets.length;

    const respondedCount = responses.filter(
      (r) =>
        r.department_id === dept.id &&
        (r.status === "acknowledged" || r.status === "approved" || r.status === "completed"),
    ).length;

    const pendingCount = Math.max(0, targetedCount - respondedCount);
    const complianceRatePercent =
      targetedCount > 0 ? Math.min(100, Math.round((respondedCount / targetedCount) * 100)) : 100;

    return {
      departmentId: dept.id,
      departmentName: dept.name_ar || dept.name_en,
      targetedCount,
      respondedCount,
      pendingCount,
      complianceRatePercent,
    };
  });
}
