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
import { CircularPriorityBadge } from "@/components/circulars/CircularPriorityBadge";
import { CircularStatusBadge } from "@/components/circulars/CircularStatusBadge";
import type { CircularReportRow } from "@/lib/reports/types";

export function CircularsReportTable({ rows }: { rows: CircularReportRow[] }) {
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
            <TableHead>{t("table.ref")}</TableHead>
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.priority")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead className="text-center">{t("table.targeted")}</TableHead>
            <TableHead className="text-center">{t("table.responded")}</TableHead>
            <TableHead className="text-end">{t("table.compliance")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                <Link href={`/circulars/${row.id}`} className="hover:text-primary hover:underline">
                  {row.refNumber}
                </Link>
              </TableCell>
              <TableCell className="font-medium text-foreground">{row.title}</TableCell>
              <TableCell>
                <CircularPriorityBadge priority={row.priority as never} />
              </TableCell>
              <TableCell>
                <CircularStatusBadge status={row.status as never} />
              </TableCell>
              <TableCell className="text-center">{row.totalTargets}</TableCell>
              <TableCell className="text-center">{row.totalResponses}</TableCell>
              <TableCell className="text-end text-xs font-semibold">
                {row.compliancePercent}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
