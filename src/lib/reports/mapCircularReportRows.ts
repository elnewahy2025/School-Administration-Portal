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
}

interface ResponseItem {
  circular_id: string;
}

export function mapCircularReportRows(
  circulars: CircularItem[],
  targets: TargetItem[],
  responses: ResponseItem[],
): CircularReportRow[] {
  return circulars.map((c) => {
    const req = targets.filter((t) => t.circular_id === c.id).length;
    const rec = responses.filter((r) => r.circular_id === c.id).length;
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
    };
  });
}
