import { useTranslations } from "next-intl";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircularTableRow } from "./CircularTableRow";
import type { CircularRow } from "@/lib/circulars/types";

export function CircularList({ circulars }: { circulars: CircularRow[] }) {
  const t = useTranslations("circulars");
  const tCommon = useTranslations("common");

  if (circulars.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
        {t("noCirculars")}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">{t("refNumber")}</TableHead>
            <TableHead>{t("circularTitle")}</TableHead>
            <TableHead className="w-24">{t("priority")}</TableHead>
            <TableHead className="w-28">{t("status")}</TableHead>
            <TableHead className="w-36">{t("responseType")}</TableHead>
            <TableHead className="w-32">{t("dueDate")}</TableHead>
            <TableHead className="w-24 text-end">{tCommon("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {circulars.map((circ) => (
            <CircularTableRow key={circ.id} circular={circ} viewLabel={tCommon("actions")} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
