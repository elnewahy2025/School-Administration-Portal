import { withApiErrorHandler, ForbiddenError } from "@/lib/errors";
import { assertCanViewAudit } from "@/lib/audit/assertCanViewAudit";
import { getSchoolAuditLogs } from "@/lib/school/getSchoolAuditLogs";
import { buildAuditCsv } from "@/lib/audit/buildAuditCsv";

async function handleAuditExport(request: Request) {
  const authCheck = await assertCanViewAudit();
  if (!authCheck.authorized) {
    throw new ForbiddenError(authCheck.error || "Unauthorized");
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || undefined;
  const entityType = searchParams.get("entityType") || undefined;
  const actorLabel = searchParams.get("actorLabel") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const result = await getSchoolAuditLogs(authCheck.schoolId, {
    action,
    entityType,
    actorLabel,
    startDate,
    endDate,
    page: 1,
    pageSize: 1000,
  });

  const csvContent = buildAuditCsv(result.logs);
  const filename = `audit-logs-${Date.now()}.csv`;

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export const GET = withApiErrorHandler(handleAuditExport);
