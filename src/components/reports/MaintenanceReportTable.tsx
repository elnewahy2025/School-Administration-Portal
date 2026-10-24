import { useTranslations } from "next-intl";
import { Link } from "@/i18n";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MaintenancePriorityBadge } from "@/components/maintenance/MaintenancePriorityBadge";
import { MaintenanceStatusBadge } from "@/components/maintenance/MaintenanceStatusBadge";
import type { MaintenanceReportRow } from "@/lib/reports/types";

export function MaintenanceReportTable({ rows }: { rows: MaintenanceReportRow[] }) {
  const t = useTranslations("reports");

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {t("noData")}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.ticket")}</TableHead>
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.priority")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.location")}</TableHead>
            <TableHead>{t("table.department")}</TableHead>
            <TableHead>{t("table.operator")}</TableHead>
            <TableHead className="text-end">Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                <Link
                  href={`/maintenance/${row.id}`}
                  className="hover:text-primary hover:underline"
                >
                  {row.ticketNumber}
                </Link>
              </TableCell>
              <TableCell className="font-medium text-foreground">{row.title}</TableCell>
              <TableCell>
                <MaintenancePriorityBadge priority={row.priority as never} />
              </TableCell>
              <TableCell>
                <MaintenanceStatusBadge status={row.status as never} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{row.locationName}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {row.departmentName ?? "—"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {row.operatorName ?? "—"}
              </TableCell>
              <TableCell className="text-end font-mono text-xs">
                {row.resolutionTimeHours !== null ? `${row.resolutionTimeHours}h` : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
