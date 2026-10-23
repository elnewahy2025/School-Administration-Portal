import type { ReportFilterParams } from "./types";

export function applyCircularReportFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  filters: ReportFilterParams,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  let q = query;
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.category) q = q.eq("category", filters.category);
  if (filters.from) q = q.gte("created_at", filters.from);
  if (filters.to) q = q.lte("created_at", `${filters.to}T23:59:59.999Z`);
  return q;
}
