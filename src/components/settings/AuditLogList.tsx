import { getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AuditLogRow } from "@/lib/school/getSchoolAuditLogs";

export async function AuditLogList({ logs }: { logs: AuditLogRow[] }) {
  const t = await getTranslations("settings");
  const tCommon = await getTranslations("common");

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        {tCommon("noData")}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-36">{t("action")}</TableHead>
            <TableHead className="w-48">{t("entity")}</TableHead>
            <TableHead>{t("actor")}</TableHead>
            <TableHead className="w-56 text-end">{t("date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const formattedDate = new Date(log.created_at).toLocaleString();

            return (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs uppercase">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  <span className="font-mono text-xs">{log.entity_type}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.actor_label || log.actor_id || "System"}
                </TableCell>
                <TableCell className="text-end font-mono text-xs text-muted-foreground">
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
