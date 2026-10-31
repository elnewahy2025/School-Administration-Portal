import { createSupabaseServerClient } from "@/lib/supabase";
import { warnOnDataTruncation } from "@/lib/supabase/warnOnDataTruncation";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { fetchCircularReportBatches } from "./fetchCircularReportBatches";
import { computeDepartmentCompliance } from "./computeDepartmentCompliance";
import { mapCircularReportRows } from "./mapCircularReportRows";
import { applyCircularReportFilters } from "./applyCircularReportFilters";
import type { ReportFilterParams, CircularsReportSummaryData } from "./types";

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

  const query = applyCircularReportFilters(baseQuery, filters);
  const { data: circulars, error: circularsError } = await query;

  if (circularsError) {
    throw mapDatabaseError(circularsError);
  }

  const circularList = (circulars ?? []) as RawCircularRow[];
  warnOnDataTruncation(circularList.length, "getCircularsReportData.circulars");

  const circularIds = circularList.map((c) => c.id);
  const departments = await getSchoolDepartments(schoolId);
  const { targets, responses } = await fetchCircularReportBatches(supabase, circularIds);

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
