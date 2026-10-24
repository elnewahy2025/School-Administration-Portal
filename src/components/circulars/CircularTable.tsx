import { useTranslations } from "next-intl";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircularTableRow } from "./CircularTableRow";
import type { CircularRow } from "@/lib/circulars/types";

export function CircularTable({
  circulars,
  canManage,
  totalDepartments,
}: {
  circulars: CircularRow[];
  canManage: boolean;
  totalDepartments?: number;
}) {
  const t = useTranslations("circulars");
  const tCommon = useTranslations("common");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-28">{t("refNumber")}</TableHead>
            <TableHead>{t("circularTitle")}</TableHead>
            <TableHead className="w-24">{t("priority")}</TableHead>
            <TableHead className="w-28">{t("status")}</TableHead>
            <TableHead className="w-48">{t("forwardedTo")}</TableHead>
            <TableHead className="w-28">{t("publishedAt")}</TableHead>
            <TableHead className="w-28">{t("dueDate")}</TableHead>
            <TableHead className="w-16 text-end">{tCommon("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {circulars.map((circ) => (
            <CircularTableRow
              key={circ.id}
              circular={circ}
              canManage={canManage}
              totalDepartments={totalDepartments}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
