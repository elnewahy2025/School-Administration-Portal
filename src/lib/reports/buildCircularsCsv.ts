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
    "الأقسام المستجيبة (Responded Departments)",
    "الأقسام غير المستجيبة (Pending Departments)",
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
    r.respondedDepartments?.map((d) => d.name).join(" - ") ?? "",
    r.pendingDepartments?.map((d) => d.name).join(" - ") ?? "",
  ]);

  return buildCsvDocument(headers, dataRows);
}
