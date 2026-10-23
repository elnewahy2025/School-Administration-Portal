import { useLocale, useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCircularDate } from "@/lib/circulars/formatCircularDate";
import type { CircularResponseRow } from "@/lib/circulars/types";

export function CircularResponseTable({ responses }: { responses: CircularResponseRow[] }) {
  const t = useTranslations("circulars");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  if (responses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {t("pending")}
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    pending: t("pending"),
    acknowledged: t("acknowledged"),
    approved: t("approved"),
    rejected: t("rejected"),
    completed: t("completed"),
    not_applicable: t("notApplicable"),
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("department")}</TableHead>
            <TableHead>{t("responder")}</TableHead>
            <TableHead className="w-28">{t("responseStatus")}</TableHead>
            <TableHead>{t("rejectionReason")}</TableHead>
            <TableHead className="w-36 text-end">{tCommon("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((res) => {
            const formattedDate = formatCircularDate(res.submitted_at, locale);

            return (
              <TableRow key={res.id}>
                <TableCell className="font-medium text-foreground">
                  {res.department_name ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{res.responder_name ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      res.status === "approved" || res.status === "completed"
                        ? "default"
                        : res.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {statusLabels[res.status] ?? res.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                  {res.reason ?? "—"}
                </TableCell>
                <TableCell
                  suppressHydrationWarning
                  className="text-end font-mono text-xs text-muted-foreground"
                >
                  {formattedDate}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
