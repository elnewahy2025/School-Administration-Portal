import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { CircularReportRow } from "./types";

interface CircularItem {
  id: string;
  ref_number: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  publish_at: string | null;
  due_at: string | null;
}

interface TargetItem {
  circular_id: string;
  department_id?: string | null;
}

interface ResponseItem {
  circular_id: string;
  department_id?: string;
}

export function mapCircularReportRows(
  circulars: CircularItem[],
  targets: TargetItem[],
  responses: ResponseItem[],
  departments: DepartmentRow[] = [],
): CircularReportRow[] {
  return circulars.map((c) => {
    const circTargets = targets.filter((t) => t.circular_id === c.id);
    const specificDeptIds = circTargets
      .map((t) => t.department_id)
      .filter((id): id is string => Boolean(id));

    const targetedDepts =
      specificDeptIds.length > 0
        ? departments.filter((d) => specificDeptIds.includes(d.id))
        : departments.filter((d) => d.is_active);

    const circResponses = responses.filter((r) => r.circular_id === c.id);

    const respondedDepartments = targetedDepts
      .filter((d) => circResponses.some((r) => r.department_id === d.id))
      .map((d) => ({ id: d.id, name: d.name_ar || d.name_en }));

    const pendingDepartments = targetedDepts
      .filter((d) => !circResponses.some((r) => r.department_id === d.id))
      .map((d) => ({ id: d.id, name: d.name_ar || d.name_en }));

    const req = targetedDepts.length > 0 ? targetedDepts.length : circTargets.length;
    const rec =
      respondedDepartments.length > 0 ? respondedDepartments.length : circResponses.length;
    const compliancePercent = req > 0 ? Math.min(100, Math.round((rec / req) * 100)) : 100;

    return {
      id: c.id,
      refNumber: c.ref_number,
      title: c.title,
      category: c.category,
      priority: c.priority,
      status: c.status,
      publishAt: c.publish_at,
      dueAt: c.due_at,
      totalTargets: req,
      totalResponses: rec,
      compliancePercent,
      respondedDepartments,
      pendingDepartments,
    };
  });
}
