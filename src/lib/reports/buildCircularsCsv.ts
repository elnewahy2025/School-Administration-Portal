import { buildCsvDocument } from "./buildCsvDocument";
import type { CircularReportRow } from "./types";

export function buildCircularsCsv(rows: CircularReportRow[]): string {
  const headers = [
    "الرقم المرجعي (Ref)",
    "العنوان (Title)",
    "التصنيف (Category)",
    "الأولوية (Priority)",
    "الحالة (Status)",
    "تاريخ النشر (Published At)",
    "تاريخ الاستحقاق (Due At)",
    "الأقسام المستهدفة (Targets)",
    "الاستجابات المستلمة (Responses)",
    "نسبة الالتزام % (Compliance %)",
  ];

  const dataRows = rows.map((r) => [
    r.refNumber,
    r.title,
    r.category,
    r.priority,
    r.status,
    r.publishAt || "",
    r.dueAt || "",
    r.totalTargets,
    r.totalResponses,
    `${r.compliancePercent}%`,
  ]);

  return buildCsvDocument(headers, dataRows);
}
