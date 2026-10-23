import { computeTicketResolutionHours } from "./computeTicketResolutionHours";
import { extractActiveOperatorName } from "./extractActiveOperatorName";
import type { MaintenanceReportRow } from "./types";

interface RawMaintenanceItem {
  id: string;
  ticket_number: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  locations?: { building: string; floor: string; room: string } | null;
  reporter?: { full_name: string } | null;
  maintenance_assignments?: Array<{
    is_active: boolean;
    operator?: { full_name: string } | null;
  }> | null;
}

export function mapMaintenanceReportRows(rawList: RawMaintenanceItem[]): {
  rows: MaintenanceReportRow[];
  priorityBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
} {
  const priorityBreakdown: Record<string, number> = {};
  const statusBreakdown: Record<string, number> = {};

  const rows: MaintenanceReportRow[] = rawList.map((t) => {
    priorityBreakdown[t.priority] = (priorityBreakdown[t.priority] || 0) + 1;
    statusBreakdown[t.status] = (statusBreakdown[t.status] || 0) + 1;

    const loc = t.locations;
    const locationName = loc ? `${loc.building} - ${loc.floor} - ${loc.room}` : "—";
    const operatorName = extractActiveOperatorName(t.maintenance_assignments);
    const resolutionTimeHours = computeTicketResolutionHours(t.created_at, t.resolved_at);

    return {
      id: t.id,
      ticketNumber: t.ticket_number,
      title: t.title,
      category: t.category,
      priority: t.priority,
      status: t.status,
      locationName,
      reporterName: t.reporter?.full_name ?? "—",
      operatorName,
      createdAt: t.created_at,
      resolvedAt: t.resolved_at,
      resolutionTimeHours,
    };
  });

  return { rows, priorityBreakdown, statusBreakdown };
}
