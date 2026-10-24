import { createSupabaseServerClient } from "@/lib/supabase";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { computeDepartmentCompliance } from "./computeDepartmentCompliance";
import { mapCircularReportRows } from "./mapCircularReportRows";
import { applyCircularReportFilters } from "./applyCircularReportFilters";
import type { ReportFilterParams, CircularsReportSummaryData } from "./types";

export async function getCircularsReportData(
  schoolId: string,
  filters: ReportFilterParams = {},
  scopedDepartmentId?: string | null,
): Promise<CircularsReportSummaryData> {
  const supabase = await createSupabaseServerClient();
  const effectiveDeptId = scopedDepartmentId || filters.departmentId;

  const baseQuery = supabase
    .from("circulars")
    .select("id, ref_number, title, category, priority, status, publish_at, due_at, created_at")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });

  interface RawCircularRow {
    id: string;
    ref_number: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    publish_at: string | null;
    due_at: string | null;
    created_at: string;
  }

  const query = applyCircularReportFilters(baseQuery, filters);
  const { data: circulars } = await query;
  const circularList = (circulars ?? []) as RawCircularRow[];
  const circularIds = circularList.map((c) => c.id);

  const departments = await getSchoolDepartments(schoolId);
  const targets: Array<{ circular_id: string; department_id: string | null }> = [];
  const responses: Array<{ circular_id: string; department_id: string; status: string }> = [];

  if (circularIds.length > 0) {
    const { data: tData } = await supabase
      .from("circular_targets")
      .select("circular_id, department_id")
      .in("circular_id", circularIds);
    if (tData) {
      targets.push(...(tData as Array<{ circular_id: string; department_id: string | null }>));
    }

    const { data: rData } = await supabase
      .from("circular_responses")
      .select("circular_id, department_id, status")
      .eq("is_latest", true)
      .in("circular_id", circularIds);
    if (rData) {
      responses.push(
        ...(rData as Array<{ circular_id: string; department_id: string; status: string }>),
      );
    }
  }

  const activeDepts = effectiveDeptId
    ? departments.filter((d) => d.id === effectiveDeptId)
    : departments;

  const departmentBreakdown = computeDepartmentCompliance({
    departments: activeDepts,
    targets,
    responses,
    circularIds,
  });

  const totalResponsesRequired = departmentBreakdown.reduce((sum, d) => sum + d.targetedCount, 0);
  const totalResponsesReceived = departmentBreakdown.reduce((sum, d) => sum + d.respondedCount, 0);
  const responseRatePercent =
    totalResponsesRequired > 0
      ? Math.min(100, Math.round((totalResponsesReceived / totalResponsesRequired) * 100))
      : 100;

  const rows = mapCircularReportRows(circularList, targets, responses, activeDepts);

  return {
    totalCirculars: circularList.length,
    publishedCount: circularList.filter(
      (c) => c.status === "published" || c.status === "in_progress",
    ).length,
    totalResponsesRequired,
    totalResponsesReceived,
    responseRatePercent,
    overdueCount: circularList.filter((c) => c.status === "overdue").length,
    departmentBreakdown,
    rows,
  };
}
