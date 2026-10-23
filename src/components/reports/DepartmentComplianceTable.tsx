import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DepartmentComplianceItem } from "@/lib/reports/types";

export function DepartmentComplianceTable({ items }: { items: DepartmentComplianceItem[] }) {
  const t = useTranslations("reports");

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{t("noData")}</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-muted/40 px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{t("complianceTable")}</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.department")}</TableHead>
            <TableHead className="text-center">{t("table.targeted")}</TableHead>
            <TableHead className="text-center">{t("table.responded")}</TableHead>
            <TableHead className="text-center">{t("table.pending")}</TableHead>
            <TableHead className="text-end">{t("table.compliance")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.departmentId}>
              <TableCell className="font-medium text-foreground">{item.departmentName}</TableCell>
              <TableCell className="text-center">{item.targetedCount}</TableCell>
              <TableCell className="text-center text-emerald-600 dark:text-emerald-400">
                {item.respondedCount}
              </TableCell>
              <TableCell className="text-center text-amber-600 dark:text-amber-400">
                {item.pendingCount}
              </TableCell>
              <TableCell className="text-end font-semibold">
                <span
                  className={
                    item.complianceRatePercent >= 80
                      ? "text-emerald-600 dark:text-emerald-400"
                      : item.complianceRatePercent >= 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400"
                  }
                >
                  {item.complianceRatePercent}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
